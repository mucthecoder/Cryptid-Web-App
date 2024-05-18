
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path'); 
require('./authfb');

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
  passport.authenticate('facebook', { scope: ['email'] }));

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









