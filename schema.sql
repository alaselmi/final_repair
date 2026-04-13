-- Smartphone Repair Management System database schema
-- Clean tables only for repair operations, user roles, tracking, and feedback.

CREATE DATABASE IF NOT EXISTS repair_company CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repair_company;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'technician', 'admin') NOT NULL DEFAULT 'client',
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
    status ENUM('Pending', 'In Progress', 'Completed') NOT NULL DEFAULT 'Pending',
    estimated_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_technician_id (technician_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS repair_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    user_id INT DEFAULT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_repair_id (repair_id),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_rating_repair_id (repair_id),
    INDEX idx_rating_user_id (user_id),
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Note: remove e-commerce tables and legacy store/cart pages in later steps.
