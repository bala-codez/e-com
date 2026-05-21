-- ─────────────────────────────────────────────────────────────
--  E-Commerce Database Initialisation
-- ─────────────────────────────────────────────────────────────

USE ecommerce_db;

-- Users
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(120)        NOT NULL,
  email       VARCHAR(200)        NOT NULL UNIQUE,
  password    VARCHAR(255)        NOT NULL,
  role        ENUM('user','admin') DEFAULT 'user',
  created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(100) NOT NULL UNIQUE,
  slug  VARCHAR(100) NOT NULL UNIQUE
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(255)   NOT NULL,
  description  TEXT,
  price        DECIMAL(10,2)  NOT NULL,
  stock        INT            DEFAULT 0,
  image_url    VARCHAR(500),
  category_id  INT,
  rating       DECIMAL(3,2)   DEFAULT 4.0,
  reviews      INT            DEFAULT 0,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Cart
CREATE TABLE IF NOT EXISTS cart (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  product_id INT NOT NULL,
  quantity   INT DEFAULT 1,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uq_cart (user_id, product_id)
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT            NOT NULL,
  total        DECIMAL(10,2)  NOT NULL,
  status       ENUM('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
  address      TEXT,
  created_at   TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  order_id   INT            NOT NULL,
  product_id INT            NOT NULL,
  quantity   INT            NOT NULL,
  price      DECIMAL(10,2)  NOT NULL,
  FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─── Seed Data ───────────────────────────────────────────────

INSERT IGNORE INTO categories (name, slug) VALUES
  ('Electronics',  'electronics'),
  ('Fashion',      'fashion'),
  ('Home & Living','home-living'),
  ('Sports',       'sports'),
  ('Beauty',       'beauty');

INSERT IGNORE INTO products (name, description, price, stock, image_url, category_id, rating, reviews) VALUES
  ('Wireless ANC Headphones',   'Premium over-ear headphones with active noise cancellation, 30-hour battery, and Hi-Res Audio support.', 249.99, 45, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 1, 4.8, 312),
  ('4K OLED Smart TV 55"',      '55-inch OLED display with Dolby Vision, HDMI 2.1, and built-in streaming apps.',                         899.99, 18, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600', 1, 4.7, 198),
  ('Mechanical Keyboard RGB',   'Compact TKL mechanical keyboard with Cherry MX switches and per-key RGB lighting.',                      129.99, 80, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600', 1, 4.6, 451),
  ('Slim Leather Wallet',       'Genuine top-grain leather bifold wallet with RFID blocking. Holds 8 cards.',                             49.99, 200,'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600', 2, 4.5, 876),
  ('Premium Sneakers',          'Lightweight running shoes with responsive foam midsole and breathable mesh upper.',                      119.99, 60, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 2, 4.7, 543),
  ('Linen Shirt – Ocean Blue',  'Relaxed-fit 100% linen shirt, perfect for warm weather. Available in multiple colours.',                 59.99, 120,'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 2, 4.4, 234),
  ('Ceramic Pour-Over Set',     'Hand-thrown ceramic dripper with matching carafe. Makes 2–4 cups. Dishwasher safe.',                     79.99, 35, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 3, 4.9, 167),
  ('Minimalist Desk Lamp',      'Architect-style LED desk lamp with touch dimmer, USB-C charging port, and warm/cool modes.',             89.99, 55, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 3, 4.6, 289),
  ('Yoga Mat Pro',              '6mm thick non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',       45.99, 150,'https://images.unsplash.com/photo-1601925228008-b09d7d6a9b9b?w=600', 4, 4.8, 632),
  ('Stainless Water Bottle',    '32 oz vacuum-insulated bottle, keeps drinks cold 48 hrs / hot 24 hrs. Leak-proof lid.',                  34.99, 300,'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600', 4, 4.7, 1024),
  ('Vitamin C Serum 30ml',      '15% L-Ascorbic Acid serum with Vitamin E and Ferulic Acid for brightening and anti-aging.',             38.99, 90, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 5, 4.5, 412),
  ('Wireless Earbuds Pro',      'True wireless earbuds with spatial audio, 6-hour playtime, IPX4 water resistance.',                     179.99, 70, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 1, 4.6, 789);
