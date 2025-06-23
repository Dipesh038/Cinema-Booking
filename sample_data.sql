-- Add sample bookings if not already present
INSERT INTO bookings (movie_name, customer_name, email, seats, total_price) VALUES
('The Matrix', 'John Doe', 'john@example.com', 'A1, A2', 25.98),
('Inception', 'Jane Smith', 'jane@example.com', 'B1, B2', 29.98),
('Interstellar', 'Bob Johnson', 'bob@example.com', 'C1, C2, C3', 41.97);

-- Add sample payments
INSERT INTO payments (booking_id, amount, payment_method, payment_status, payment_date) VALUES
(1, 25.98, 'Credit Card', 'Paid', NOW()),
(2, 29.98, 'PayPal', 'Paid', NOW()),
(3, 41.97, 'Debit Card', 'Paid', NOW());

-- Add sample reviews
INSERT INTO reviews (movie_name, customer_name, rating, comment) VALUES
('The Matrix', 'John Doe', 5, 'Amazing movie, great special effects!'),
('Inception', 'Jane Smith', 4, 'Mind-bending plot, loved it!'),
('Interstellar', 'Bob Johnson', 5, 'One of the best sci-fi movies ever made.');

-- Add sample booking_seats
INSERT INTO booking_seats (booking_id, seat_id) VALUES
(1, 1), -- Booking 1, Seat A1
(1, 2), -- Booking 1, Seat A2
(2, 3), -- Booking 2, Seat B1
(3, 1), -- Booking 3, Seat A1
(3, 2), -- Booking 3, Seat A2
(3, 3); -- Booking 3, Seat B1 