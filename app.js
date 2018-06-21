var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var userController = require('./routers/user.js')
var authController = require('./routers/auth.js')
var showController = require('./routers/show.js')
var attractionController = require('./routers/attraction.js')
var tagController = require('./routers/tag.js')

var app = express();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authController.router)
// app.use(authController.checkBearer)
app.use('/user', userController)
app.use('/show', showController)
app.use('/tags', tagController)
app.use('/attraction', attractionController)
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
