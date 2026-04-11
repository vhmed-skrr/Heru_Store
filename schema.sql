-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table: categories
CREATE TABLE categories (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar varchar(255) NOT NULL,
    name_en varchar(255) NOT NULL,
    color varchar(50),
    icon varchar(255),
    sort_order integer DEFAULT 0,
    active bool DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: products
CREATE TABLE products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar varchar(255) NOT NULL,
    name_en varchar(255) NOT NULL,
    description_ar text,
    description_en text,
    price decimal(10, 2) NOT NULL,
    stock integer DEFAULT 0,
    category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
    images text[],
    attributes jsonb DEFAULT '{}'::jsonb,
    featured bool DEFAULT false,
    active bool DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: orders
CREATE TABLE orders (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number varchar(100) UNIQUE NOT NULL,
    customer_name varchar(255) NOT NULL,
    phone varchar(50) NOT NULL,
    governorate varchar(100) NOT NULL,
    city varchar(100) NOT NULL,
    address text NOT NULL,
    items jsonb NOT NULL,
    subtotal decimal(10, 2) NOT NULL,
    discount decimal(10, 2) DEFAULT 0,
    coupon_code varchar(100),
    total decimal(10, 2) NOT NULL,
    status varchar(50) DEFAULT 'pending',
    payment_method varchar(50) NOT NULL,
    payment_status varchar(50) DEFAULT 'unpaid',
    notes text,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: coupons
CREATE TABLE coupons (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code varchar(100) UNIQUE NOT NULL,
    type varchar(50) NOT NULL, -- e.g., 'percentage', 'fixed'
    value decimal(10, 2) NOT NULL,
    min_order decimal(10, 2) DEFAULT 0,
    product_ids text[],
    active bool DEFAULT true,
    uses_count integer DEFAULT 0,
    max_uses integer,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: reviews
CREATE TABLE reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id uuid REFERENCES products(id) ON DELETE CASCADE,
    reviewer_name varchar(255) NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    approved bool DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: store_reviews
CREATE TABLE store_reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_name varchar(255) NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    comment text,
    approved bool DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: suggestions
CREATE TABLE suggestions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(255),
    phone varchar(50),
    description text NOT NULL,
    image_url text,
    status varchar(50) DEFAULT 'new',
    created_at timestamp with time zone DEFAULT now()
);

-- Table: settings
CREATE TABLE settings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    key varchar(100) UNIQUE NOT NULL,
    value text,
    created_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON orders(phone);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- SECURITY: RLS Policies (Updated per architecture)
-- -----------------------------------------------------------------------------

-- SELECT (READ) Policies
CREATE POLICY "Public can read active categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (true);
CREATE POLICY "Public can read active coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
CREATE POLICY "Public can read approved reviews" ON reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public can read approved store_reviews" ON store_reviews FOR SELECT USING (approved = true);

-- INSERT (WRITE) Policies for Public (Submitting orders, suggestions, etc)
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert store_reviews" ON store_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert suggestions" ON suggestions FOR INSERT WITH CHECK (true);

-- ADMIN: Authenticated Do-All Policies (Must be authenticated and implicitly admin)
CREATE POLICY "Auth can do all on categories" ON categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on products" ON products TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on orders" ON orders TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on coupons" ON coupons TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on reviews" ON reviews TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on store_reviews" ON store_reviews TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on suggestions" ON suggestions TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Auth can do all on settings" ON settings TO authenticated USING (true) WITH CHECK (true);
