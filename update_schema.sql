-- Add gender column to bookings table
ALTER TABLE bookings ADD COLUMN gender VARCHAR(10) AFTER customer_name;

-- Update existing bookings with sample gender data
UPDATE bookings SET gender = 'Male' WHERE id = 1;
UPDATE bookings SET gender = 'Female' WHERE id = 2;
UPDATE bookings SET gender = 'Male' WHERE id = 3; 