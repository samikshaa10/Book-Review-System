
const express = require('express');
const dotenv = require('dotenv');
// Corrected to relative path
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());

// Import routes (corrected to relative paths)
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const searchRoutes = require('./routes/search');

// Mount routes (CRITICAL CORRECTION: Use URL paths, not file paths)
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes); // Assuming /api/reviews is the base for review-specific routes
app.use('/api/search', searchRoutes);

// Basic route for home
app.get('/', (req, res) => {
  res.send('Book Review API is running...');
});

// For any routes that are not found (Optional, but good practice for 404)
app.use((req, res, next) => {
    res.status(404).send('API endpoint not found');
});

// Error handling middleware (Optional, but good for catching errors)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


module.exports = app;