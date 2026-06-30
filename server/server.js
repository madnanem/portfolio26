require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*', // For local development, allow any origin. In production, configure to specific frontend URL.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-password']
}));

// Body parser middleware
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
  console.log('Attempting to connect to MongoDB...');
  mongoose.connect(MONGO_URI)
    .then(() => {
      console.log('MongoDB successfully connected.');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      console.log('WARNING: Server will fall back to local JSON database storage.');
    });
} else {
  console.log('No MONGO_URI provided in environment variables.');
  console.log('NOTICE: Server is running with local JSON database storage.');
}

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'));
  });
} else {
  // Root API route status
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Portfolio API. The server is online and running.' });
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`API endpoints accessible at http://localhost:${PORT}/api`);
});
