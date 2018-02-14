var express = require('express');
var router = express.Router();
var i18n = require('../../i18n/index')
/* RENDER home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ramayana Ballet - Book Ticket Online', h: i18n.header[req.session.lang] });
});

module.exports = router;
