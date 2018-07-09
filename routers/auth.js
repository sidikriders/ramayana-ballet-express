var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var models = require('../models')
var User = models.user
var TokenList = models.tokenList

router.get('/', (req, res, next) => {
  var bearer = req.get('RB-Bearer')
  if (!bearer) {
    res.send({
      status: false,
      code: 401,
      data: 'unauthorized'
    })
  } else {
    TokenList.findOne({
      where: {
        token: bearer
      }
    }).then(_token => {
      if (!_token) {
        res.send({
          status: false,
          code: 401,
          data: 'token not valid'
        })
      } else {
        jwt.verify(_token.token, 'secret', { algorithm: 'RS256' }, (err, decoded) => {
          if (err || !decoded.username || !decoded.role || !decoded.exp) {
            _token.destroy().then(() => {
              res.send({
                status: false,
                code: 401,
                data: 'token is wrong'
              })
            }).catch(err => {
              next(err)
            })
          } else if (Number(decoded.exp) < new Date().getTime()) {
            _token.destroy().then(() => {
              res.send({
                status: false,
                code: 401,
                data: 'token expired'
              })
            }).catch(err => {
              next(err)
            })
          } else {
            var _decoded = decoded
            delete _decoded.iat
            res.send({
              status: true,
              data: _decoded
            })
          }
        })
      }
      }).catch(err => {
      next(err)
    })
  }
})

router.post('/login', (req, res, next) => {
  var body = req.body
  var username = body.username
  var password = body.password
  if (!username || !password) {
    res.send({
      status: false,
      data: 'data not complete'
    })
  } else {
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
        res.send({
          status: false,
          data: 'user not exist'
        })
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            next(err)
          } else {
            if (!result) {
              res.send({
                status: false,
                data: 'wrong password'
              })
            } else {
              var token = jwt.sign({
                username: user.username,
                role: user.role.name,
                exp: new Date().setDate(new Date().getDate() + 1)
              }, 'secret')
              TokenList.create({
                token: token
              }).then(_token => {
                res.send({
                  status: true,
                  data: {
                    username: user.username,
                    role: user.role.name,
                    token: token
                  }
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
  }
})

router.get('/logout', (req, res, next) => {
  var token = req.get('Bearer')
  if (!token) {
    res.send({
      status: false,
      data: 'token invalid'
    })
  } else {
    TokenList.findOne({
      where: {
        token: token
      }
    }).then(_token => {
      if (!_token) {
        res.send({
          status: false,
          data: 'token not found'
        })
      } else {
        return _token.destroy().then( () => res.send({
          status: true,
          data: 'success'
        })).catch(err => next(err))
      }
    }).catch(err => {
      next(err)
    })
  }
})

module.exports = {
  router,
  checkBearer: (req, res, next) => {
    var bearer = req.get('RB-Bearer')
    if (!bearer || bearer === 'undefined') {
      res.send({
        status: false,
        code: 401,
        data: 'unauthorized'
      })
    } else {
      TokenList.findOne({
        where: {
          token: bearer
        }
      }).then(_token => {
        if (!_token) {
          res.send({
            status: false,
            code: 401,
            data: 'token not valid'
          })
        } else {
          jwt.verify(_token.token, 'secret', { algorithm: 'RS256' }, (err, decoded) => {
            if (err || !decoded.username || !decoded.role || !decoded.exp) {
              _token.destroy().then(() => {
                res.send({
                  status: false,
                  code: 401,
                  data: 'token is wrong'
                })
              }).catch(err => {
                next(err)
              })
            } else if (Number(decoded.exp) < new Date().getTime()) {
              _token.destroy().then(() => {
                res.send({
                  status: false,
                  code: 401,
                  data: 'token expired'
                })
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