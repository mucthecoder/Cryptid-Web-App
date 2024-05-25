var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const session = require("express-session");
const passport = require("passport");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameRouter = require('./routes/game');
var authRouter = require('./routes/auth.js');

const userController = require("./controllers/userController");

//=============== Auth =====================
const Google_Email = require("./auth/passport.js").Google_Email;
Google_Email(passport);
const Github_Email = require("./auth/passport.js").Github_Email;
Github_Email(passport);

//=========================================== 

var app = express();

app.use(session({
    secret:"CryptidWebAp~byTheGreatestTeam!!!",
    resave: false,
    saveUninitialized:false,
    cookie:{
        maxAge: 30 * 60 * 1000 // 30 minutes
    }
}));

//passport initialization
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/auth', authRouter);
module.exports = app;
