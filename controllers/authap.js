const passport = require('passport');
const AppleStrategy = require('passport-apple').Strategy;

passport.use(new AppleStrategy({
    clientID: '960383452488982',
    teamID: '1fb6cbdf82ac689ae57ca7c7e708f9d6',
    callbackURL: "http://localhost:5000/auth/apple/callback",
    
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    // Verify or create user logic here
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
