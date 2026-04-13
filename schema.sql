CREATE DATABASE IF NOT EXISTS repair_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE repair_site;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hero_settings (
    id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT ''
);

INSERT INTO hero_settings (id, title, description)
VALUES (1, 'Get your phone fixed faster with guided repair and proactive support.', 'On-demand smartphone repair that feels like a digital assistant helping every step of the way.')
ON DUPLICATE KEY UPDATE title = VALUES(title), description = VALUES(description);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, brand, category, price, image, description) VALUES
('Tempered Glass Screen Protector', 'ClearGuard', 'Accessories', 19.99, 'images/tempered-glass.svg', 'Ultra-clear protection that keeps your screen scratch-free without losing touch sensitivity.'),
('Fast Wireless Charger', 'VoltWave', 'Chargers', 29.99, 'images/wireless-charger.svg', 'Compact wireless charging pad for fast top-up sessions at home or on the desk.'),
('Phone Grip & Stand', 'GripMate', 'Cases', 14.99, 'images/phone-grip.svg', 'Slim grip accessory for easier handling and hands-free media viewing.'),
('USB-C Power Cable', 'ChargePro', 'Cables', 9.99, 'images/usb-c-cable.svg', 'Durable braided charging cable for fast charge and data transfer.');

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    model VARCHAR(255) NOT NULL,
    service VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    duration VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Scheduled',
    notes TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS repair_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    device_type VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    status ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
    estimated_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS repair_updates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Pending','In Progress','Completed') DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS repair_ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT UNSIGNED NOT NULL,
    comment TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (repair_id) REFERENCES repair_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
