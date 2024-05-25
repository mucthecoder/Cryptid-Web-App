var express = require('express');
const passport = require("passport");
var router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        req.session.user_id = req.user._id;
        req.session.username = req.user.username;
        res.redirect('/home');
});

router.get('/github', passport.authenticate('github', { scope: ['email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user_id = req.user._id;
    req.session.username = req.user.username;
    res.redirect('/home');
});

module.exports = router;
