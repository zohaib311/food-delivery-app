-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 13, 2026 at 04:04 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodieshub`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `is_available` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `description`, `price`, `category`, `image`, `is_available`, `created_at`) VALUES
(2, 'Margherita Pizza', 'Classic pizza with fresh tomatoes, mozzarella, and basil.', 499.00, 'Pizza', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 12:05:28'),
(4, 'burger', 'asfg', 3444.00, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 12:14:58'),
(5, 'Margherita Pizza', 'Classic pizza with fresh tomatoes, mozzarella, and basil.\nClassic pizza with fresh tomatoes, mozzarella, and basil.', 699.00, 'Pizza', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 12:50:26'),
(6, 'pratha roll', 'delicious pratharoll', 3444.00, 'Asian', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 12:52:28'),
(7, 'new pratha', 'new item', 453.00, 'Asian', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 12:56:54'),
(8, 'new 2 pratha', 'another new', 124.00, 'Salads', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 13:19:59'),
(9, 'new 3 pratha', 'another new 3', 869.99, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 13:26:33'),
(10, 'new 4 pratha', 'another new 4', 859.99, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 13:27:20'),
(11, 'edit burger 2', 'edit burger 2', 534.00, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', 1, '2026-02-11 13:36:34');

-- --------------------------------------------------------

--
-- Table structure for table `offers`
--

CREATE TABLE `offers` (
  `id` bigint(20) NOT NULL,
  `title` varchar(150) DEFAULT NULL,
  `discount_type` enum('percentage','flat') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer_targets`
--

CREATE TABLE `offer_targets` (
  `id` bigint(20) NOT NULL,
  `offer_id` bigint(20) NOT NULL,
  `target_type` enum('restaurant','category','item') NOT NULL,
  `target_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `delivery_fee` decimal(10,2) DEFAULT 0.00,
  `delivery_name` varchar(150) NOT NULL,
  `delivery_phone` varchar(20) NOT NULL,
  `delivery_address` text NOT NULL,
  `delivery_city` varchar(100) NOT NULL,
  `delivery_zip` varchar(20) NOT NULL,
  `payment_method` enum('card','upi','cod') DEFAULT 'cod',
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `payment_reference` varchar(255) DEFAULT NULL,
  `card_brand` varchar(50) DEFAULT NULL,
  `card_last4` varchar(4) DEFAULT NULL,
  `payment_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payment_meta`)),
  `order_status` enum('pending','accepted','preparing','on_the_way','delivered','cancelled') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `delivery_fee`, `delivery_name`, `delivery_phone`, `delivery_address`, `delivery_city`, `delivery_zip`, `payment_method`, `payment_status`, `payment_reference`, `card_brand`, `card_last4`, `payment_meta`, `order_status`, `created_at`) VALUES
(1, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 07:40:47'),
(2, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'card', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 07:42:32'),
(3, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'upi', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 07:42:40'),
(4, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 09:00:30'),
(5, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 09:05:36'),
(6, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 09:15:54'),
(7, 10, 3494.00, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'pending', '2026-02-13 09:23:26'),
(8, 10, 422.00, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'on_the_way', '2026-02-13 09:24:15'),
(9, 10, 584.00, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'accepted', '2026-02-13 09:51:28'),
(10, 10, 174.00, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'cancelled', '2026-02-13 10:59:42'),
(11, 10, 909.99, 50.00, 'Zohaib Aslam', '03066815287', 'house #15, block D, al-jannat Homes, kahna nuh.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'delivered', '2026-02-13 11:15:58'),
(12, 11, 584.00, 50.00, 'Rehman Akram', '11223344556', '5D, Al-jannat Homes, Khana nuh, Lahore.', 'Lahore', '53100', 'cod', 'pending', NULL, NULL, NULL, '{\"delivery_instructions\":\"\"}', 'delivered', '2026-02-13 13:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `menu_item_id` bigint(20) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `menu_item_id`, `quantity`, `price`) VALUES
(1, 5, 10, 1, 859.00),
(2, 6, 10, 1, 859.00),
(3, 7, 6, 1, 3444.00),
(4, 8, 8, 3, 124.00),
(5, 9, 11, 1, 534.00),
(6, 10, 8, 1, 124.00),
(7, 11, 10, 1, 859.00),
(8, 12, 11, 1, 534.00);

-- --------------------------------------------------------

--
-- Table structure for table `restaurants`
--

CREATE TABLE `restaurants` (
  `id` bigint(20) NOT NULL,
  `owner_id` bigint(20) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `is_open` tinyint(4) DEFAULT 1,
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `restaurant_categories`
--

CREATE TABLE `restaurant_categories` (
  `id` bigint(20) NOT NULL,
  `restaurant_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_categories`
--

CREATE TABLE `sub_categories` (
  `id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(120) DEFAULT NULL,
  `status` tinyint(4) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','restaurant','admin') DEFAULT 'customer',
  `status` tinyint(4) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `status`, `created_at`, `token`) VALUES
(8, 'Ruman', 'ruman@gmail.com', '11223344556', '$2y$10$OgHNrjQH6YqzUPtGUB3O7.JkwQ2sJ6.91H77AMBiTh6254cgO3SaG', 'admin', 1, '2026-02-10 15:50:26', '4566343a14cb1f3830b4c99374334d14'),
(10, 'Zohaib Aslam', 'zohaib@gmail.com', '03066815287', '$2y$10$6S7f8bawpvPRzPCTSodrSuHR/Xdy6Ty.rVS9utc5SkDNnRtsydF8a', 'customer', 1, '2026-02-11 10:30:14', '8cf006cfcd34da55c7e6d3a265ae634d'),
(11, 'Rehman', 'rehman@gmail.com', '11228976655', '$2y$10$gDR5Baa8YWEK15Q0jwIazOQa/c7bLMY42CrTgWg6axXfIhrEaT6OC', 'customer', 1, '2026-02-11 10:30:40', '148b64c6b910e58e1f1b075a322dccf5');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `offer_targets`
--
ALTER TABLE `offer_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `offer_id` (`offer_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_id` (`order_id`);

--
-- Indexes for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `owner_id` (`owner_id`);

--
-- Indexes for table `restaurant_categories`
--
ALTER TABLE `restaurant_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurant_id` (`restaurant_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `offers`
--
ALTER TABLE `offers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer_targets`
--
ALTER TABLE `offer_targets`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `restaurant_categories`
--
ALTER TABLE `restaurant_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_categories`
--
ALTER TABLE `sub_categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `offer_targets`
--
ALTER TABLE `offer_targets`
  ADD CONSTRAINT `offer_targets_ibfk_1` FOREIGN KEY (`offer_id`) REFERENCES `offers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_items_orders` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Constraints for table `restaurants`
--
ALTER TABLE `restaurants`
  ADD CONSTRAINT `restaurants_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `restaurant_categories`
--
ALTER TABLE `restaurant_categories`
  ADD CONSTRAINT `restaurant_categories_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `restaurant_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sub_categories`
--
ALTER TABLE `sub_categories`
  ADD CONSTRAINT `sub_categories_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
