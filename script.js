document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content loaded, starting to fetch data...');
    
    // Function to show errors to the user
    function showError(message) {
      const errorContainer = document.getElementById('errorContainer');
      if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
      }
      console.error(message);
    }
    
    // Verify DOM elements exist
    const elements = [
      'moviesSelect', 'theatresSelect', 'screensSelect', 'showsSelect', 
      'seatsSelect', 'paymentsSelect', 'reviewsSelect', 'snacksSelect', 
      'bookingSeatsSelect', 'selectedMovie', 'selectedSeats', 'totalPrice'
    ];
    
    let missingElements = [];
    elements.forEach(id => {
      const element = document.getElementById(id);
      if (!element) {
        missingElements.push(id);
        console.error(`Element with ID ${id} not found in the DOM!`);
      }
    });
    
    if (missingElements.length > 0) {
      showError(`Missing elements in the DOM: ${missingElements.join(', ')}`);
    }
    
    const endpoints = [
      { id: 'moviesSelect', url: 'movies', label: 'title' },
      { id: 'theatresSelect', url: 'theatres', label: 'name' },
      { id: 'screensSelect', url: 'screens', label: 'screen_name' },
      { id: 'showsSelect', url: 'shows', label: 'show_time' },
      { id: 'seatsSelect', url: 'seats', label: 'seat_number' },
      { id: 'paymentsSelect', url: 'payments', label: 'payment_method' },
      { id: 'reviewsSelect', url: 'reviews', label: 'customer_name' },
      { id: 'snacksSelect', url: 'snacks', label: 'snack_name' },
      { id: 'bookingSeatsSelect', url: 'booking_seats', label: 'booking_id' }
    ];
  
    endpoints.forEach(endpoint => {
      console.log(`Fetching ${endpoint.url}...`);
      const select = document.getElementById(endpoint.id);
      if (!select) {
        console.error(`Element with ID ${endpoint.id} not found!`);
        return;
      }
      
      fetch(`http://localhost:3000/api/${endpoint.url}`)
        .then(res => {
          console.log(`${endpoint.url} response status:`, res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log(`${endpoint.url} data:`, data ? (data.length || 0) : 'no data');
          if (!data || data.length === 0) {
            console.warn(`No data received for ${endpoint.url}`);
            return;
          }
          
          // Clear existing options first
          select.innerHTML = '';
          
          // Add a default option
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = `-- Select ${endpoint.url} --`;
          select.appendChild(defaultOption);
          
          data.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.textContent = item[endpoint.label] || `(No ${endpoint.label})`;
            select.appendChild(opt);
          });
          console.log(`Added ${data.length} options to ${endpoint.id}`);
        })
        .catch(err => {
          const errorMsg = `Error fetching ${endpoint.url}: ${err.message}`;
          console.error(errorMsg);
          showError(errorMsg);
        });
    });
  
    const movieSelect = document.getElementById('moviesSelect');
    const seatsSelect = document.getElementById('seatsSelect');
    const selectedMovieSpan = document.getElementById('selectedMovie');
    const selectedSeatsSpan = document.getElementById('selectedSeats');
    const totalPriceSpan = document.getElementById('totalPrice');
    const bookingForm = document.getElementById('bookingForm');
    const bookingConfirmation = document.getElementById('bookingConfirmation');
    const bookingId = document.getElementById('bookingId');
    const confirmMovie = document.getElementById('confirmMovie');
    const confirmName = document.getElementById('confirmName');
    const confirmGender = document.getElementById('confirmGender');
    const confirmEmail = document.getElementById('confirmEmail');
    const confirmSeats = document.getElementById('confirmSeats');
    const confirmPrice = document.getElementById('confirmPrice');
    const newBookingBtn = document.getElementById('newBookingBtn');
  
    let currentMoviePrice = 0;
    let selectedSeats = [];
    let movies = []; // Store movie data
  
    // Handle movie selection
    movieSelect.addEventListener('change', updateSelectedMovie);
  
    // Handle seat selection
    seatsSelect.addEventListener('change', function () {
      selectedSeats = Array.from(seatsSelect.selectedOptions).map(option => option.textContent);
      updateBookingSummary();
    });
  
    // Update selected movie
    function updateSelectedMovie() {
      const selectedMovieId = parseInt(movieSelect.value);
      const selectedMovie = movies.find(movie => movie.id === selectedMovieId);
  
      if (selectedMovie) {
        selectedMovieSpan.textContent = selectedMovie.title;
        currentMoviePrice = selectedMovie.price;
        updateBookingSummary();
      } else {
        selectedMovieSpan.textContent = 'None';
        currentMoviePrice = 0;
        updateBookingSummary();
      }
    }
  
    // Update booking summary
    function updateBookingSummary() {
      if (selectedSeats.length > 0) {
        selectedSeatsSpan.textContent = selectedSeats.join(', ');
      } else {
        selectedSeatsSpan.textContent = 'None';
      }
  
      const totalPrice = selectedSeats.length * currentMoviePrice;
      totalPriceSpan.textContent = totalPrice.toFixed(2);
    }
  
    // Handle booking submission
    bookingForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const customerName = document.getElementById('customerName').value.trim();
      const gender = document.getElementById('gender').value.trim();
      const email = document.getElementById('email').value.trim();
      const movieId = parseInt(movieSelect.value);
  
      if (!customerName || !email || !gender || isNaN(movieId) || selectedSeats.length === 0) {
        alert('Please fill in all fields and select at least one seat.');
        return;
      }
  
      const selectedMovie = movies.find(movie => movie.id === movieId);
      const totalPrice = selectedSeats.length * currentMoviePrice;
  
      const bookingData = {
        movie_name: selectedMovie.title,
        customer_name: customerName,
        gender: gender,
        email: email,
        seats: selectedSeats.join(', '),
        total_price: totalPrice
      };
  
      // Submit booking data to backend
      fetch('http://localhost:3000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
        .then(response => response.json())
        .then(data => {
          if (!data.booking_id) {
            throw new Error('Booking creation failed');
          }
          
          // Get the booking ID from the response
          const bookingId = data.booking_id;
          
          // For each selected seat, create a booking_seat record
          const seatPromises = selectedSeats.map(seatNumber => {
            // Find the seat ID based on the seat number
            const seat = Array.from(seatsSelect.options).find(option => 
              option.textContent === seatNumber
            );
            
            if (!seat) return Promise.resolve();
            
            return fetch('http://localhost:3000/api/booking_seats', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                booking_id: bookingId,
                seat_id: seat.value
              })
            });
          });
          
          // Wait for all seat bookings to complete
          return Promise.all(seatPromises).then(() => data);
        })
        .then(data => {
          bookingId.textContent = data.booking_id;
          confirmMovie.textContent = selectedMovie.title;
          confirmName.textContent = customerName;
          confirmGender.textContent = gender;
          confirmEmail.textContent = email;
          confirmSeats.textContent = selectedSeats.join(', ');
          confirmPrice.textContent = totalPrice.toFixed(2);

          bookingForm.parentElement.style.display = 'none';
          bookingConfirmation.style.display = 'block';
        })
        .catch(error => {
          console.error('Fetch error:', error);
          alert('Failed to create booking. Please try again.');
        });
    });
  
    // Reset booking form for a new booking
    newBookingBtn.addEventListener('click', function () {
      bookingForm.reset();
      selectedSeats = [];
      currentMoviePrice = 0;
      selectedMovieSpan.textContent = 'None';
      selectedSeatsSpan.textContent = 'None';
      totalPriceSpan.textContent = '0.00';
      bookingForm.parentElement.style.display = 'block';
      bookingConfirmation.style.display = 'none';
    });
  
    // Populate movie data
    function populateMovies() {
      console.log('Fetching movies for dropdown...');
      fetch('http://localhost:3000/api/movies')
        .then(res => {
          console.log('Movies response status:', res.status);
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log(`Received ${data ? data.length : 0} movies`);
          movies = data; // Save the movie data
          
          if (!data || data.length === 0) {
            console.warn('No movie data received');
            showError('No movies found in the database. Please check your database setup.');
            return;
          }
          
          // Clear existing options
          movieSelect.innerHTML = '';
          
          // Add a default option
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.textContent = '-- Select a movie --';
          movieSelect.appendChild(defaultOption);
          
          data.forEach(movie => {
            try {
              const option = document.createElement('option');
              option.value = movie.id;
              option.textContent = `${movie.title} ($${parseFloat(movie.price).toFixed(2)})`;
              movieSelect.appendChild(option);
            } catch (e) {
              console.error('Error adding movie option:', e, movie);
            }
          });
          console.log(`Added ${data.length} movie options to dropdown`);
        })
        .catch(err => {
          const errorMsg = `Error fetching movie data: ${err.message}`;
          console.error(errorMsg);
          showError(errorMsg);
        });
    }
  
    // Initialize
    populateMovies();
  });
  