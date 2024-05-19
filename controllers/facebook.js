const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: '453961490558859',
    clientSecret:   '7ef3c13a5844b8bb493c04d029b5a7e7',

    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
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

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path'); 


const app = express();

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}
// Middleware to handle requests for favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());


app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html')); // Correct file path concatenation
});

app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email','phonenumber'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
   
    res.redirect('/protected');
  });



app.get('/protected', isLoggedIn, (req, res) => {
  res.send('Hello ${req.user.displayName}');
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.send('Goodbye!');
});

app.get('/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(3000, () => console.log('listening on port: 5000'));









