var express = require('express');
var router = express.Router();

/* RENDER home page. */
router.get('*', (req, res, next) => {
  var lang = req.originalUrl.split('/')[1]
  if (!req.session.lang) {
    res.locals.lang = req.session.lang = lang
  }
  res.locals.oriUrlMinLang = req.originalUrl.split('/').filter(str => str !== 'id' && str !== 'en').join('/')
  res.locals.h = i18n.header[req.session.lang]
  console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>.')
  next()
});

module.exports = router;