var router = require('express').Router()

var models = require('../models')
var Attraction = models.attraction
var AttractionGroup = models.attractionGroup

// get all group
router.get('/', (req, res, next) => {
  AttractionGroup.findAll({
    include: [
      {
        model: Attraction,
        attributes: ['id', 'name', 'nameEn']
      }
    ]
  }).then(groups => {
    res.status(200).send(groups)
  }).catch(err => {
    next(err)
  })
})

// get one group
router.get('/:id', (req, res, next) => {
  AttractionGroup.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Attraction,
        attributes: ['id', 'name', 'nameEn']
      }
    ]
  }).then(tag => {
    res.status(200).send(tag)
  }).catch(err => {
    next(err)
  })
})

// create group
router.post('/', (req, res, next) => {
  AttractionGroup.create({
    name: req.body.name,
    nameEn: req.body.nameEn
  }).then(newGroup => {
    res.status(200).send(newGroup)
  }).catch(err => {
    next(err)
  })
})

// delete group
router.delete('/:id', (req, res, next) => {
  AttractionGroup.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.status(200).send(true)
  }).catch(err => {
    next(err)
  })
})

module.exports = router;