const session = require('express-session');

const SESSION_SECRET = process.env.SESSION_SECRET || 'your-secret-key-change-in-production';

/**
 * Configure Express session middleware
 */
function configureSession() {
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    }
  });
}

module.exports = {
  configureSession
};

