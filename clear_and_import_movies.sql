-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Clear the movies table
DELETE FROM movies;

-- Reset the auto-increment counter
ALTER TABLE movies AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Now import the data from add_movies.sql
SOURCE add_movies.sql; 