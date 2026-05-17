// =====================================================
// SERVER.JS - Main Entry Point for the Backend API
// Hormuud University - Cloud Computing Research Survey
// =====================================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ---- Middleware ----
// Allow requests from the Vite dev server (port 3000) and any deployed frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ---- Routes ----
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/surveys', require('./routes/survey.routes'));

// ---- Health Check ----
app.get('/', (req, res) => {
  res.json({ message: 'Hormuud Cloud Survey API is running!' });
});

// ---- Connect to MongoDB and Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });
