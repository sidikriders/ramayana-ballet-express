var router = require('express').Router()
var bcrypt = require('bcrypt')

var models = require('../models')
var User = models.user
var Role = models.role

// get all role
router.get('/role', (req, res, next) => {
  Role.findAll({
    attributes: ['id', 'name']
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})

// get one role
router.get('/role/:id', (req, res, next) => {
  Role.findOne({
    where: {
      id: req.params.id
    }
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})

// create one role
router.post('/role', (req, res, next) => {
  Role.create({
    name: req.body.name
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})

// delete one role
router.delete('/role/:id', (req, res, next) => {
  Role.findById(req.params.id).then(_role => {
    if (!_role) {
      res.status(400).send('role not exist')
    } else {
      return Promise.all([
          User.destroy({
            where: {
              roleId: _role.id
            }
          }),
          _role.destroy()
        ]).then(() => {
          res.status(200).send(true)
        }).catch(err => {
          next(err)
        })
    }
  }).catch(err => {
    next(err)
  })
})

// get all user
router.get('/', (req, res, next) => {
  User.findAll({
    attributes: ['id', 'username'],
    include: [{
      model: Role,
      attributes: ['id', 'name']
    }]
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})

// get one user
router.get('/:id', (req, res, next) => {
  User.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'username'],
    include: [{
      model: Role,
      attributes: ['id', 'name']
    }]
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})

// post create user
router.post('/', (req, res, next) => {
  var username = req.body.username
  var pass = req.body.password
  var roleId = req.body.roleId

  if (!username || !pass || !roleId) {
    res.status(400).send('data not complete')
  } else if (pass.length < 5) {
    res.status(400).send('pass need at least 5 characters')
  } else if (username.length < 5) {
    res.status(400).send('username need at least 5 character')
  } else if (username.includes(' ')) {
    res.status(400).send('username cannot contain space')
  } else {
    bcrypt.hash(pass, 10, function(err, hash) {
      User.create({
        username: username,
        password: hash,
        roleId: roleId
      }).then(resp => {
        res.status(200).send(resp)
      }).catch(err => {
        next(err)
      })
    })
  }
})

// delete one user
router.delete('/:id', (req, res, next) => {
  User.findById(req.params.id).then(_user => {
    if (!_user) {
      res.status(400).send('user not exist')
    } else {
      _user.destroy().then(() => {
        res.status(200).send('success delete user ' + _user.username)
      }).catch(err => {
        next(err)
      })
    }
  }).catch(err => {
    next(err)
  })
})

module.exports = router