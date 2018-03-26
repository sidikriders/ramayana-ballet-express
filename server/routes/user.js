var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

var router = express.Router();
var models = require('../models');
var User = models.User
var UserRole = models.User_role
var saltCount = require('../app-config.js').bcryptConf.saltCount
var _authorize = require('../controllers/authorize.js')
var secretKey = require('../app-config.js').secretKeyJWT

// create User
router.post('/', _authorize.superAdmin, (req, res, next) => {
  if (!req.body.email || !validateEmail(req.body.email)) {
    res.status(401).send('need email')
  } else if (!req.body.password || !validatePasswod(req.body.password)) {
    res.status(401).send('need stronger password')
  } else if (!req.body.roleId) {
    res.status(401).send('need user role')
  } else {
    var hash = req.body.password ? bcrypt.hashSync(req.body.password, saltCount) : null;

    User.create({
      email: req.body.email,
      password: hash,
      roleId: req.body.roleId
    }).then(user => res.status(200).send(user))
    .catch(err => res.status(400).send(err))
  }
})

// get all user
router.get('/', _authorize.superAdmin, (req, res, next) => {
  User.findAll({
    include: {
      model: UserRole,
      as: 'roleDetail'
    }
  })
  .then(users => res.status(200).send(users))
  .catch(err => {
    res.status(400).send(err)
  })
})

// check login and get roleId
router.get('/check-login', (req, res, next) => {
  if (!req.get('loginToken')) {
    res.status.send('no token detected')
  } else {
    var token = req.get('loginToken')
    var decryptedObj = jwt.verify(token, secretKey)
    res.status(200).send(decryptedObj)
  }
})

// get one user
router.get('/:id', _authorize.superAdmin, (req, res, next) => {
  User.findById(req.params.id, {
    include: {
      model: UserRole,
      as: 'roleDetail'
    }
  }).then(user => {
    if (user) {
      res.status(200).send(user)
    } else {
      res.status(401).send('user didn\'t exist')
    }
  }).catch(err => res.status(400).send(err))
})

//  update one user
router.put('/:id', _authorize.superAdmin, (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    if (user) {
      var hash = req.body.password ? bcrypt.hashSync(req.body.password, saltCount) : null;
      user.update({
        email: req.body.email || user.email,
        password: hash || user.password,
        role: req.body.roleId || user.role
      }).then(() => res.status(200).send(user))
      .catch(err => res.status(400).send(err))
    } else {
      res.status(200).send('user didn\'t exist')
    }
  })
  .catch(err => res.status(400).send(err))
})

// delete one user
router.delete('/:id', _authorize.superAdmin, (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    if (!user) {
      res.status(401).send('user didn\'t exist')
    } else {
      user.destroy().then(() => res.status(200).send(user))
      .catch(err => res.status(401).send(err))
    }
  }).catch(err => res.status(401).send(err))
})

// login
router.post('/login', (req, res, next) => {
  if (!req.body.email) {
    res.status(401).send('email not detected')
  } else if (!req.body.password) {
    res.status(401).send('password not detected')
  } else {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (!user) {
        res.status(401).send('user doesn\'t exist')
      } else if (bcrypt.compareSync(req.body.password, user.password)) {
        var userDetail = user.dataValues
        var jwtToken = jwt.sign({
          email: userDetail.email,
          roleId: userDetail.roleId
        }, secretKey)
        res.status(200).send(jwtToken)
      } else {
        res.status(401).send('wrong password')
      }
    }).catch(err => {
      res.status(400).send(err)
    })
  }
})

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validatePasswod(pass) {
  if (pass.length > 4) {
    return true
  } else {
    return false
  }
}

module.exports = router;
