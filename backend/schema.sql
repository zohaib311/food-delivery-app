-- Create the food_delivery_app database
CREATE DATABASE IF NOT EXISTS foodieshub;
USE foodieshub;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer','restaurant','admin') DEFAULT 'customer',
    status TINYINT DEFAULT 1,
    token VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE IF NOT EXISTS items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    image VARCHAR(500),
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample items
INSERT INTO items (name, description, price, category, image) VALUES
('Margherita Pizza', 'Classic pizza with fresh tomatoes, mozzarella, and basil.', 9.99, 'Pizza', 'https://example.com/images/margherita.jpg'),
('Chicken Burger', 'Grilled chicken patty with lettuce, tomato and mayo.', 7.50, 'Burgers', 'https://example.com/images/chicken_burger.jpg'),
('Caesar Salad', 'Romaine lettuce, parmesan, croutons and Caesar dressing.', 6.25, 'Salads', 'https://example.com/images/caesar_salad.jpg'),
('Spicy Tacos', 'Three soft tacos with seasoned beef, lettuce, and cheddar.', 8.99, 'Mexican', 'https://example.com/images/tacos.jpg'),
('Pad Thai', 'Stir-fried rice noodles with shrimp, egg, and peanuts.', 10.50, 'Asian', 'https://example.com/images/pad_thai.jpg');

-- Ensure token column exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS token VARCHAR(255) DEFAULT NULL;
