
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const session = require('express-session');
const path = require('path');

const router = express.Router();

// Configure session middleware for this router
router.use(session({
  secret: "CryptidWebAp~byTheGreatestTeam!!!",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 6000 * 60
  }
}));

// Initialize Passport and restore authentication state, if any, from the session
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
  callbackURL: "https://playcryptidweb.azurewebsites.net/google/callback",
      clientID: "813500182154-rb9qve19jksavhheklmiiger4kfs52j7.apps.googleusercontent.com",
      clientSecret: "GOCSPX-sbXUhLu7FFFbbE6K48kgrZoFLii",
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done) {
  return done(null, profile);
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Define routes for Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/profile'); // Redirect to a profile page or some other page after successful login
  });

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

router.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`<h1>Hello ${req.user.displayName}</h1>`);
});

module.exports = router;
