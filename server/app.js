require('dotenv').config()

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Sequelize = require('sequelize')
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store)

var i18n = require('./i18n/index')
var pageRouter = require('./routes/page-controllers/index');
var homeRouter = require('./routes/page-controllers/home');
var apiRouter = require('./routes/api-controllers/index')
var globalMiddleware = require('./helpers/global-middleware')

var dbConfig = JSON.parse(process.env.DB_CONFIG);
var sequelize = new Sequelize(`mysql://${dbConfig.username}:${dbConfig.password}@localhost:3306/${dbConfig.database}`)

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public/img/favicon', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({ db: sequelize })
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res, next) => {
  if (!req.session.lang) {
    res.locals.lang = req.session.lang = 'en'
  } else {
    res.locals.lang = req.session.lang
  }
  res.locals.oriUrlMinLang = req.originalUrl.split('/').filter(str => str !== 'id' && str !== 'en').join('/')
  res.locals.h = i18n.header[req.session.lang]
  next()
}, homeRouter);

app.use('/api', apiRouter)
app.use('/id', (req, res, next) => {
  res.locals.lang = req.session.lang = 'id'
  res.locals.oriUrlMinLang = req.originalUrl.split('/').filter(str => str !== 'id' && str !== 'en').join('/')
  res.locals.h = i18n.header[req.session.lang]
  next()
}, pageRouter)
app.use('/en', (req, res, next) => {
  res.locals.lang = req.session.lang = 'en'
  res.locals.oriUrlMinLang = req.originalUrl.split('/').filter(str => str !== 'id' && str !== 'en').join('/')
  res.locals.h = i18n.header[req.session.lang]
  next()
}, pageRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var lang = req.originalUrl.split('/')[1]
  if (lang === 'id' || lang === 'en') {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    if (!req.session.lang) {
      req.session.lang = 'en'
    }
    console.log(req.originalUrl)
    res.redirect(301, `/${req.session.lang}${req.originalUrl}`)
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
