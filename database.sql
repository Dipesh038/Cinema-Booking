CREATE TABLE IF NOT EXISTS movies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT,
    price DECIMAL(10,2) NOT NULL,
    release_date DATE
);

CREATE TABLE IF NOT EXISTS theatres (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS screens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    screen_name VARCHAR(50) NOT NULL,
    theatre_id INT,
    capacity INT,
    FOREIGN KEY (theatre_id) REFERENCES theatres(id)
);

CREATE TABLE IF NOT EXISTS shows (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT,
    screen_id INT,
    show_time DATETIME,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (screen_id) REFERENCES screens(id)
);

CREATE TABLE IF NOT EXISTS seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    screen_id INT,
    seat_number VARCHAR(10),
    seat_type VARCHAR(50),
    FOREIGN KEY (screen_id) REFERENCES screens(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_name VARCHAR(255),
    customer_name VARCHAR(255),
    email VARCHAR(255),
    seats TEXT,
    total_price DECIMAL(10,2),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    amount DECIMAL(10,2),
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    payment_date TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    movie_name VARCHAR(255),
    customer_name VARCHAR(255),
    rating INT,
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS snacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    snack_name VARCHAR(255),
    price DECIMAL(10,2),
    description TEXT
);

CREATE TABLE IF NOT EXISTS booking_seats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    seat_id INT,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- Insert sample data
INSERT INTO movies (title, description, duration, price, release_date) VALUES
('The Matrix', 'A computer programmer discovers a mysterious world', 136, 12.99, '1999-03-31'),
('Inception', 'A thief who steals corporate secrets', 148, 14.99, '2010-07-16'),
('Interstellar', 'A team of explorers travel through a wormhole in space', 169, 13.99, '2014-11-07');

INSERT INTO theatres (name, location) VALUES
('Cinemax Downtown', '123 Main St'),
('Cinemax Uptown', '456 Park Ave');

INSERT INTO screens (screen_name, theatre_id, capacity) VALUES
('Screen 1', 1, 100),
('Screen 2', 1, 80),
('Screen 3', 2, 120);

INSERT INTO seats (screen_id, seat_number, seat_type) VALUES
(1, 'A1', 'Regular'),
(1, 'A2', 'Regular'),
(1, 'B1', 'Premium'),
(2, 'A1', 'Regular'),
(2, 'A2', 'Regular'),
(3, 'A1', 'Premium');

INSERT INTO shows (movie_id, screen_id, show_time) VALUES
(1, 1, '2024-03-20 18:00:00'),
(2, 2, '2024-03-20 19:00:00'),
(3, 3, '2024-03-20 20:00:00');

INSERT INTO snacks (snack_name, price, description) VALUES
('Popcorn Large', 8.99, 'Fresh buttery popcorn'),
('Nachos', 7.99, 'Crispy nachos with cheese'),
('Soda Combo', 5.99, 'Large soda with free refill'); 