var express = require('express');
var router = express.Router();

/* RENDER home page. */
router.get('/test', function (req, res, next) {
  res.send('asik')
});

module.exports = router;
