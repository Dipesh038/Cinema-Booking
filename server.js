const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'dkwarrier', // change if needed
  database: 'CINEMAX_BOOKING'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL Database:', err);
    throw err;
  }
  console.log('✅ Connected to MySQL Database!');
  
  // Test query to verify data
  db.query('SELECT COUNT(*) as count FROM movies', (err, result) => {
    if (err) {
      console.error('❌ Error querying movies table:', err);
    } else {
      console.log(`✅ Database contains ${result[0].count} movies`);
    }
  });

  db.query('SHOW TABLES', (err, result) => {
    if (err) {
      console.error('❌ Error listing tables:', err);
    } else {
      console.log('✅ Available tables:', result.map(row => Object.values(row)[0]).join(', '));
    }
  });
});

// 🎬 Movies
app.get('/api/movies', (_, res) => {
  console.log('📽️ Movies API endpoint called');
  db.query('SELECT * FROM movies', (err, result) => {
    if (err) {
      console.error('❌ Error fetching movies:', err);
      return res.status(500).send(err);
    }
    console.log(`✅ Fetched ${result.length} movies`);
    res.json(result);
  });
});

// 🏢 Theatres
app.get('/api/theatres', (_, res) => {
  console.log('🏢 Theatres API endpoint called');
  db.query('SELECT * FROM theatres', (err, result) => {
    if (err) {
      console.error('❌ Error fetching theatres:', err);
      return res.status(500).send(err);
    }
    console.log(`✅ Fetched ${result.length} theatres`);
    res.json(result);
  });
});

// 🖥️ Screens
app.get('/api/screens', (_, res) => {
  console.log('🖥️ Screens API endpoint called');
  db.query('SELECT * FROM screens', (err, result) => {
    if (err) {
      console.error('❌ Error fetching screens:', err);
      return res.status(500).send(err);
    }
    console.log(`✅ Fetched ${result.length} screens`);
    res.json(result);
  });
});

// 🕒 Shows
app.get('/api/shows', (_, res) => {
  db.query('SELECT * FROM shows', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// 💺 Seats
app.get('/api/seats', (_, res) => {
  db.query('SELECT * FROM seats', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// 🎟️ Bookings
app.get('/api/bookings', (_, res) => {
  db.query('SELECT * FROM bookings', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/api/bookings', (req, res) => {
  const { movie_name, customer_name, gender, email, seats, total_price } = req.body;
  const sql = 'INSERT INTO bookings (movie_name, customer_name, gender, email, seats, total_price) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [movie_name, customer_name, gender, email, seats, total_price], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Booking successful!', booking_id: result.insertId });
  });
});

// 💵 Payments
app.get('/api/payments', (_, res) => {
  db.query('SELECT * FROM payments', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/api/payments', (req, res) => {
  const { booking_id, amount, payment_method } = req.body;
  const sql = 'INSERT INTO payments (booking_id, amount, payment_method, payment_status, payment_date) VALUES (?, ?, ?, ?, NOW())';
  db.query(sql, [booking_id, amount, payment_method, 'Paid'], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Payment recorded!' });
  });
});

// ⭐ Reviews
app.get('/api/reviews', (_, res) => {
  db.query('SELECT * FROM reviews', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// 🍿 Snacks
app.get('/api/snacks', (_, res) => {
  db.query('SELECT * FROM snacks', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// 🔗 Booking Seats
app.get('/api/booking_seats', (_, res) => {
  db.query('SELECT * FROM booking_seats', (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.post('/api/booking_seats', (req, res) => {
  const { booking_id, seat_id } = req.body;
  const sql = 'INSERT INTO booking_seats (booking_id, seat_id) VALUES (?, ?)';
  db.query(sql, [booking_id, seat_id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Booking seat added!', id: result.insertId });
  });
});

// 🚀 Start server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
