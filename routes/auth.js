var express = require('express');
const passport = require("passport");
var router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        req.session.user_id = req.user._id;
        res.redirect('/home');
});

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/users/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.user_id = req.user._id;
    res.redirect('/home');
});

module.exports = router;