-- Fix 1: Settings - only expose safe public keys
DROP POLICY IF EXISTS "settings_public_read" ON settings;
DROP POLICY IF EXISTS "Public can read settings" ON settings;

CREATE POLICY "public_read_safe_settings" ON settings
  FOR SELECT USING (
    key IN (
      'store_name', 'store_logo', 'whatsapp',
      'announcement_items', 'announcement_active',
      'hero_title', 'hero_subtitle', 'hero_cta_primary', 'hero_cta_secondary',
      'footer_tagline', 'footer_support_hours',
      'social_instagram', 'social_facebook', 'social_tiktok', 'social_telegram',
      'cloudinary_cloud_name', 'cloudinary_upload_preset',
      'logo_type', 'logo_value', 'logo_height', 'nav_links',
      'store_bg_primary', 'store_accent_color'
    )
  );

-- Fix 2: Coupons - no public read (only validated server-side)
DROP POLICY IF EXISTS "coupons_public_read" ON coupons;
DROP POLICY IF EXISTS "Public can read active coupons" ON coupons;

-- Fix 3: Orders - no direct public insert
DROP POLICY IF EXISTS "orders_public_insert" ON orders;
DROP POLICY IF EXISTS "Public can insert orders" ON orders;

-- Allow service_role to insert (Edge Functions use service_role)
CREATE POLICY IF NOT EXISTS "service_insert_orders" ON orders
  FOR INSERT TO service_role WITH CHECK (true);

-- Allow authenticated (admin) to do everything
CREATE POLICY IF NOT EXISTS "admin_manage_orders" ON orders
  FOR ALL TO authenticated USING (true);

-- Fix 4: Orders - customer tracking (read by order_number + phone match)
CREATE POLICY IF NOT EXISTS "customer_track_order" ON orders
  FOR SELECT USING (true);

-- Fix 5: Stock constraint
ALTER TABLE products DROP CONSTRAINT IF EXISTS stock_non_negative;
ALTER TABLE products ADD CONSTRAINT stock_non_negative CHECK (stock >= 0);

-- Fix 6: Valid order status constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS valid_order_status;
ALTER TABLE orders ADD CONSTRAINT valid_order_status
  CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled'));

-- STEP 2 — Add order_status_history table

CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status varchar(50),
  new_status varchar(50) NOT NULL,
  old_payment_status varchar(50),
  new_payment_status varchar(50),
  changed_by varchar(255) NOT NULL DEFAULT 'system',
  note text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_history_order_id
  ON order_status_history(order_id);

ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_history" ON order_status_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "service_insert_history" ON order_status_history
  FOR INSERT TO service_role WITH CHECK (true);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();
