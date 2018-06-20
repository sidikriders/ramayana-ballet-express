var router = require('express').Router()

var models = require('../models')
var Tag = models.tag

// get all tags
router.get('/', (req, res, next) => {
  Tag.findAll().then(tags => {
    res.status(200).send(tags)
  }).catch(err => {
    next(err)
  })
})

// get one tag
router.get('/:id', (req, res, next) => {
  Tag.findOne({
    where: {
      id: req.params.id
    }
  }).then(tag => {
    res.status(200).send(tag)
  }).catch(err => {
    next(err)
  })
})

// create tag
router.post('/', (req, res, next) => {
  Tag.create({
    name: req.body.name,
    nameEn: req.body.nameEn
  }).then(newTag => {
    res.status(200).send(newTag)
  }).catch(err => {
    next(err)
  })
})

// delete tag
router.delete('/:id', (req, res, next) => {
  Tag.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.status(200).send(true)
  }).catch(err => {
    next(err)
  })
})

module.exports = router