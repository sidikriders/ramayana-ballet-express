var jwt = require('jsonwebtoken')

var secretKey = require('../app-config.js').secretKeyJWT

module.exports = {
  superAdmin: function(req, res, next) {
    var loginToken = req.get('loginToken')
    if (!loginToken) {
      res.status(401).send('unautherized')
    } else {
      var decrypted = jwt.verify(loginToken, secretKey)
      if (decrypted.roleId === 1) {
        next()
      } else {
        res.status(400).send('logged in but unauthorized')
      }
    }
  }
}