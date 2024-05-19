const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const mongoose = require('mongoose');
const User = require('../models/user.model.js'); 



mongoose.connect("mongodb+srv://Qwertyui1:neyon71133@cluster0.zbdv8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "https://playcryptidweb.azurewebsites.net/google/callback",
      clientID: "813500182154-rb9qve19jksavhheklmiiger4kfs52j7.apps.googleusercontent.com",
      clientSecret:    "GOCSPX-sbXUhLu7FFFbbE6K48kgrZoFLii"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Checking if user already exists in the database
        let user = await User.findOne({ googleId: profile.id });
       
    
        if (user) {
          return done(null, user); // User exists, return user data
        } else {
          // create a new user
          user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value
          });

          await user.save(); // Save the new user to the database
          return done(null, user); // Return the newly created user
        }
      } catch (err) {
        return done(err, null); // Pass any errors to the done callback
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

const app = express();

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.sendFile(__dirname,'../public/html')
});

app.get('/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

app.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to home page
    res.redirect('/');
  });

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
