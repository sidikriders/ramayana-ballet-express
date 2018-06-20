var router = require('express').Router()

var models = require('../models')
var Attraction = models.attraction
var AttractionGroup = models.attractionGroup
var AttractionImage = models.attractionImage

// get all attraction
router.get('/', (req, res, next) => {
  Attraction.findAll({
    include: [
      {
        model: AttractionGroup,
        key: 'id'
      }, {
        model: AttractionImage,
        key: 'id'
      }, 'tags'
    ]
  }).then(attractions => {
    res.status(200).send(attractions)
  }).catch(err => {
    next(err)
  })
})

// get all group attraction

module.exports = router;