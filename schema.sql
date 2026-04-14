-- Smartphone Repair Management System database schema
-- Clean tables only for repair operations, user roles, tracking, and feedback.

CREATE DATABASE IF NOT EXISTS repair_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repair_site;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'technician', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS repair_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    technician_id INT DEFAULT NULL,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    status ENUM('Pending', 'In Progress', 'Ready', 'Delivered', 'Completed') NOT NULL DEFAULT 'Pending',
    estimated_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_repair_requests_user_id (user_id),
    INDEX idx_repair_requests_technician_id (technician_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    old_status ENUM('Pending', 'In Progress', 'Ready', 'Delivered', 'Completed') DEFAULT NULL,
    new_status ENUM('Pending', 'In Progress', 'Ready', 'Delivered', 'Completed') DEFAULT NULL,
    status ENUM('Pending', 'In Progress', 'Ready', 'Delivered', 'Completed') DEFAULT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_repair_updates_repair_id (repair_id),
    INDEX idx_repair_updates_user_id (user_id),
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_repair_ratings_repair_id (repair_id),
    INDEX idx_repair_ratings_user_id (user_id),
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    model VARCHAR(150) NOT NULL,
    service VARCHAR(150) NOT NULL,
    date DATE NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    notes TEXT DEFAULT NULL,
    status ENUM('Scheduled', 'In repair', 'Ready for pickup', 'Completed') NOT NULL DEFAULT 'Scheduled',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bookings_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hero_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section VARCHAR(100) NOT NULL DEFAULT 'main',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hero_settings_section (section)
);

-- Note: this schema now matches the current PHP code and API table usage.
