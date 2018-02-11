var express = require('express');
var router = express.Router();

/* RENDER home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Ramayana Ballet - Book Ticket Online' });
});

router.get('/asik', function (req, res, next) {
  var lang = req.session.lang
  if (lang === 'id') {
    res.send('asik')
  } else {
    res.send('cool')
  }
});

module.exports = router;
