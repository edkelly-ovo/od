const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || 'ovo.com';
const CALLBACK_URL = process.env.CALLBACK_URL || `http://localhost:${process.env.PORT || 3000}/auth/google/callback`;

/**
 * Configure Passport Google OAuth Strategy
 */
function configurePassport() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn('Warning: Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
    return;
  }

  passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {
      // Check if user's email domain matches allowed domain
      const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
      const emailDomain = email.split('@')[1];
      
      if (emailDomain !== ALLOWED_DOMAIN) {
        return done(null, false, { message: `Access restricted to @${ALLOWED_DOMAIN} accounts only.` });
      }
      
      // Return user profile
      return done(null, {
        id: profile.id,
        email: email,
        name: profile.displayName,
        picture: profile.photos && profile.photos[0] ? profile.photos[0].value : null
      });
    }
  ));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

module.exports = {
  configurePassport,
  ALLOWED_DOMAIN
};

