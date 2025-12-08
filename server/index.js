require('dotenv').config();
const express = require('express');
const path = require('path');
const passport = require('passport');
const { configureSession } = require('./config/session');
const { configurePassport } = require('./config/auth');
const { ensureAuthenticated } = require('./middleware/auth');
const podsRoutes = require('./routes/pods');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure session
app.use(configureSession());

// Initialize Passport
configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

// Auth routes (public)
app.use('/auth', authRoutes);

// API routes (protected)
app.use('/api/pods', ensureAuthenticated, podsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
