-- Movie Revenue Analysis Query
-- This query returns each movie's title, total tickets sold, and total revenue,
-- ordered by highest revenue first

SELECT m.title, COUNT(bs.id) AS total_tickets_sold, 
       SUM(b.total_price) AS total_revenue
FROM movies m
JOIN shows s ON m.id = s.movie_id
JOIN bookings b ON b.movie_name = m.title
JOIN booking_seats bs ON bs.booking_id = b.id
GROUP BY m.id
ORDER BY total_revenue DESC; 