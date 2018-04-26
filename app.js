var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var userController = require('./routers/user.js')

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userController)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.data = 'Not Found'
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.error(new Error(err))
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
