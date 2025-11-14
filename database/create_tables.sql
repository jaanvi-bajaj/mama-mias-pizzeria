CREATE DATABASE IF NOT EXISTS mamamias_pizzeria;
USE mamamias_pizzeria;

CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category ENUM('pizza', 'appetizer', 'salad', 'dessert', 'beverage') DEFAULT 'pizza',
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INT NOT NULL,
    notes TEXT,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO menu_items (name, description, price, category) VALUES
('Margherita', 'Classic pizza with tomato sauce, mozzarella, and fresh basil', 12.99, 'pizza'),
('Pepperoni', 'Tomato sauce, mozzarella, and pepperoni', 14.99, 'pizza'),
('Quattro Formaggi', 'Four cheese pizza with mozzarella, gorgonzola, parmesan, and fontina', 16.99, 'pizza'),
('Vegetariana', 'Tomato sauce, mozzarella, peppers, mushrooms, olives, and onions', 15.99, 'pizza'),
('Diavola', 'Spicy pizza with tomato sauce, mozzarella, spicy salami, and chili peppers', 15.99, 'pizza'),
('Prosciutto e Funghi', 'Tomato sauce, mozzarella, prosciutto, and mushrooms', 17.99, 'pizza'),
('Capricciosa', 'Tomato sauce, mozzarella, ham, mushrooms, artichokes, and olives', 17.99, 'pizza'),
('Hawaiiana', 'Tomato sauce, mozzarella, ham, and pineapple', 14.99, 'pizza');

INSERT INTO testimonials (customer_name, rating, comment, approved) VALUES
('John Smith', 5, 'Best pizza in town! The Margherita is absolutely authentic.', TRUE),
('Sarah Johnson', 5, 'Amazing atmosphere and delicious food. Highly recommend!', TRUE),
('Michael Brown', 4, 'Great pizza, friendly staff. Will definitely come back.', TRUE),
('Emily Davis', 5, 'The Quattro Formaggi is to die for! Perfect cheese blend.', TRUE),
('David Wilson', 5, 'Authentic Italian experience. Feels like being in Naples!', TRUE),
('Lisa Anderson', 4, 'Wonderful pizza and excellent service. A bit pricey but worth it.', TRUE);