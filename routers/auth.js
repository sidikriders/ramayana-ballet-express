var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var models = require('../models')
var User = models.user
var TokenList = models.tokenList

router.post('/login', (req, res, next) => {
  var body = req.body
  var username = body.username
  var password = body.password

  User.findOne({
    where: {
      username: username
    },
    attributes: ['id', 'username', 'password'],
    include: [{
      model: models.role,
      attributes: ['id', 'name']
    }]
  }).then(user => {
    if (!user) {
      res.status(400).send('user not exist')
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          next(err)
        } else {
          if (!result) {
            res.status(401).send('wrong password')
          } else {
            var token = jwt.sign({
              username: user.username,
              role: user.role.name,
              exp: new Date().setDate(new Date().getDate() + 1)
            }, 'secret')
            TokenList.create({
              token: token
            }).then(_token => {
              res.status(200).send({
                username: user.username,
                role: user.role.name,
                token: token
              })
            }).catch(err3 => {
              next(err3)
            })
          }
        }
      })
    }
  }).catch(err => {
    next(err)
  })
})

module.exports = {
  router,
  checkBearer: (req, res, next) => {
    var bearer = req.get('Bearer')
    if (!bearer) {
      res.status(401).send('unauthorized')
    } else {
      TokenList.findOne({
        where: {
          token: bearer
        }
      }).then(_token => {
        if (!_token) {
          res.status(401).send('token not valid')
        } else {
          jwt.verify(_token.token, 'secret', { algorithm: 'RS256' }, (err, decoded) => {
            if (err || !decoded.username || !decoded.role || !decoded.exp) {
              _token.destroy().then(() => {
                res.status(401).send('token is wrong')
              }).catch(err => {
                next(err)
              })
            } else if (Number(decoded.exp) < new Date().getTime()) {
              _token.destroy().then(() => {
                res.status(401).send('token expired')
              }).catch(err => {
                next(err)
              })
            } else {
              next()
            }
          })
        }
      }).catch(err => {
        next(err)
      })
    }
  }
}