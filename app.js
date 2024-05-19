var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


const session = require("express-session");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameRouter = require('./routes/game');
var authRouter = require('./controllers/passport');
const userController = require("./controllers/userController")

var app = express();

app.use(session({
    secret:"CryptidWebAp~byTheGreatestTeam!!!",
    resave: false,
    saveUninitialized:false,
    cookie:{
        maxAge: 6000 * 60
    }
}));

app.use(userController.verifyUserData);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);
app.use('/', authRouter);
module.exports = app;
