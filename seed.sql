INSERT INTO settings (key, value) VALUES
  ('store_name', 'Heru'),
  ('whatsapp', '201124519232'),
  ('free_shipping_threshold', '0'),
  ('admin_email', '[ADMIN_EMAIL]')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
