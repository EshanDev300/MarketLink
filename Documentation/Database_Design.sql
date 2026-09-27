-- =====================================================================
-- MARKETLINK (eGreen Basket) - RELATIONAL DATABASE SCHEMA DEFINITION
-- Aptech TechWiz 7 - Software Requirements Specification (Version 1.0)
-- Compatible with MySQL 8.0+ / PostgreSQL / SQL Server
-- =====================================================================

CREATE DATABASE IF NOT EXISTS marketlink_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE marketlink_db;

-- ---------------------------------------------------------------------
-- Table: Users
-- Role-based authentication and user profiles (Customer, Farmer, Admin)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('customer', 'farmer', 'admin') NOT NULL DEFAULT 'customer',
    name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(30) NULL,
    address TEXT NULL,
    status ENUM('active', 'pending', 'suspended') NOT NULL DEFAULT 'active',
    stall_name VARCHAR(100) NULL,
    contact_person VARCHAR(100) NULL,
    pickup_time_windows VARCHAR(100) DEFAULT '08:00 AM - 01:00 PM',
    order_cutoff_hours INT DEFAULT 4,
    latitude DECIMAL(10, 8) DEFAULT 37.77490000,
    longitude DECIMAL(11, 8) DEFAULT -122.41940000,
    bio TEXT NULL,
    avatar_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Markets
-- Community Farmers Market Hubs and Geolocation Coordinates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS markets (
    market_id INT AUTO_INCREMENT PRIMARY KEY,
    market_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) DEFAULT 'San Francisco',
    operating_days VARCHAR(100) NOT NULL DEFAULT 'Saturday, Sunday',
    timings VARCHAR(100) NOT NULL DEFAULT '08:00 AM - 01:30 PM',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    map_provider VARCHAR(30) DEFAULT 'OpenStreetMap',
    stall_count INT DEFAULT 20,
    image_url VARCHAR(255) NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Categories
-- Master data for agricultural product classification
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NULL,
    icon VARCHAR(50) DEFAULT 'bi-basket',
    badge_text VARCHAR(50) DEFAULT 'Farm Fresh',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Products
-- Farm-fresh inventory listings with weekly recurring stock templates
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id INT NOT NULL,
    market_id INT NULL,
    category_id INT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'kg',
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(255) NULL,
    is_sold_out BOOLEAN DEFAULT FALSE,
    is_recurring_template BOOLEAN DEFAULT TRUE,
    harvest_day VARCHAR(50) DEFAULT 'Friday Morning',
    rating_average DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(market_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Orders
-- Customer Pre-Orders (settled in person at pickup)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    farmer_id INT NOT NULL,
    market_id INT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status ENUM('placed', 'accepted', 'ready_for_pickup', 'completed', 'cancelled') NOT NULL DEFAULT 'placed',
    pickup_date VARCHAR(50) NOT NULL,
    pickup_time_slot VARCHAR(50) NOT NULL,
    cutoff_time VARCHAR(100) NULL,
    special_instructions TEXT NULL,
    payment_status VARCHAR(100) DEFAULT 'Pay In-Person at Pickup (Cash/Card/UPI)',
    cancellation_reason TEXT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (market_id) REFERENCES markets(market_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Order_Items
-- Line items associated with each pre-order
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Reviews
-- Verified post-order ratings and farmer feedback responses
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NULL,
    farmer_id INT NOT NULL,
    customer_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    farmer_reply TEXT NULL,
    farmer_reply_at TIMESTAMP NULL,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL,
    FOREIGN KEY (farmer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Reports
-- Platform analytics and managerial insights
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    generated_by INT NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    parameters JSON NULL,
    summary_data JSON NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (generated_by) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Table: Announcements
-- Global platform broadcasts and vendor notifications
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    announcement_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    audience ENUM('all', 'farmers', 'customers') NOT NULL DEFAULT 'all',
    type VARCHAR(30) DEFAULT 'info',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- INITIAL SEED TEST DATA
-- ---------------------------------------------------------------------
INSERT INTO categories (name, description, icon, badge_text) VALUES
('Vegetables', 'Freshly harvested crisp root and leafy vegetables', 'bi-flower1', 'Harvest Fresh'),
('Fruits', 'Sun-ripened orchard fruits and fresh berries', 'bi-apple', 'Naturally Sweet'),
('Dairy & Eggs', 'Pasture-raised eggs and farm artisanal cheeses', 'bi-egg', 'Pasture Raised'),
('Bakery', 'Naturally fermented rustic sourdough and sweet pastries', 'bi-cake2', 'Baked Daily'),
('Honey & Preserves', 'Pure raw honey, bee pollen, and artisanal fruit jams', 'bi-droplet', 'Pure & Raw'),
('Herbs & Greens', 'Aromatic culinary herbs and tender microgreens', 'bi-tree', 'Aromatic');

INSERT INTO markets (market_name, address, city, operating_days, timings, latitude, longitude, map_provider, stall_count) VALUES
('Downtown Green Farmers Market', '100 Plaza Central, Civic Center, San Francisco, CA', 'San Francisco', 'Saturday, Sunday', '08:00 AM - 01:30 PM', 37.7793, -122.4192, 'OpenStreetMap', 28),
('Sunset Harbor Organic Pavilion', 'Pier 24 Esplanade, Marina District, San Francisco, CA', 'San Francisco', 'Wednesday, Saturday', '09:00 AM - 02:00 PM', 37.7600, -122.4800, 'OpenStreetMap', 22),
('Oakridge Community Eco Market', '550 Elmwood Avenue, North Valley Park, CA', 'Oakridge', 'Tuesday, Thursday, Saturday', '08:30 AM - 01:30 PM', 37.7950, -122.4000, 'OpenStreetMap', 19),
('Meadowview Country Fair Market', '1200 Old County Fairgrounds, Meadowview, CA', 'Meadowview', 'Sunday', '07:30 AM - 12:30 PM', 37.7500, -122.4400, 'OpenStreetMap', 25);
