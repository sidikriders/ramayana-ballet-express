var express = require('express');
var router = express.Router();

/* RENDER home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ramayana Ballet - Book Ticket Online' });
});

module.exports = router;
