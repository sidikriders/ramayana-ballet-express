var express = require('express');

var router = express.Router();
var models = require('../models');
var userRole = models.User_role
var Users = models.User
// Create user role
router.post('/', function(req, res, next) {
  if (req.body.name && req.body.name !== '') {
    userRole
    .create({
      name: req.body.name
    })
    .then(roles => res.status(201).send(roles))
    .catch( err => res.status(401).send(err))
  } else {
    res.status(401).send('need name for new user role')
  }
})

// Get all user role.
router.get('/', function(req, res, next) {
  userRole.findAll()
  .then(roles => res.status(200).send(roles))
  .catch(err => {
    res.status(400).send(err)
  })
});

// Get one user role
router.get('/:id', (req, res, next) => {
  userRole.findById(req.params.id)
  .then(role => {
    if (role) {
      res.status(200).send(role)
    } else {
      res.status(400).send('role doesn\'t exist')
    }
  })
  .catch(err => res.status(401).send(err))
})

// Update user role
router.put('/:id', (req, res, next) => {
  userRole.findById(req.params.id)
    .then(role => {
      if (!role) {
        res.status(404).send('role not found')
      } else {
        role.update({
          name: req.body.name || role.name
        })
        .then(() => res.status(200).send(role))
        .catch(err => res.status(400).send(err))
      }
    })
    .catch(err => res.status(400).send(err))
})

// Delete one user role
router.delete('/:id', (req, res, next) => {
  userRole.destroy({
    where: {
      id: req.params.id
    }
  }).then(role => {
    res.status(200).send(role)
  }).catch(err => {
    res.status(400).send(err)
  })
})

module.exports = router;
