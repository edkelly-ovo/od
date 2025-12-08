/**
 * Authentication middleware
 * Ensures user is authenticated before accessing protected routes
 */
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized', authenticated: false });
}

module.exports = {
  ensureAuthenticated
};

