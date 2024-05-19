const passport = require('passport');
const express = require('express');
const session = require('express-session');

const GoogleStrategy = require('passport-google-oauth2').Strategy;

//const User = require('../models/user.model.js');
const path = require('path');
const AppleStrategy = require('passport-apple').Strategy;

// passport.use(new AppleStrategy({
//     clientID: '960383452488982',
//     teamID: '1fb6cbdf82ac689ae57ca7c7e708f9d6',
//     callbackURL: "http://localhost:5000/auth/apple/callback",
    
//     passReqToCallback: true
//   },
//   function(req, accessToken, refreshToken, profile, done) {
//     // Verify or create user logic here
//     return done(null, profile);
//   }
// ));

passport.use(new GoogleStrategy({
  clientID: '813500182154-rb9qve19jksavhheklmiiger4kfs52j7.apps.googleusercontent.com',
  clientSecret: 'GOCSPX-sbXUhLu7FFFbbE6K48kgrZoFLii',
  callbackURL: 'https://playcryptidweb.azurewebsites.net/google/callback',
  passReqToCallback: true
},
function(request, accessToken, refreshToken, profile, done)  {
  return done(null,profile);
     
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

const app = express();

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
