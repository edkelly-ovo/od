const express = require('express');
const router = express.Router();
const passport = require('passport');

/**
 * GET /auth/google
 * Initiate Google OAuth login
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

/**
 * GET /auth/google/callback
 * Handle Google OAuth callback
 */
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  function(req, res) {
    // Successful authentication
    res.redirect('/');
  }
);

/**
 * GET /auth/logout
 * Logout user
 */
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

/**
 * GET /auth/status
 * Check authentication status
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        email: req.user.email,
        name: req.user.name,
        picture: req.user.picture
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;

