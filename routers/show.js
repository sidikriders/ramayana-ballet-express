var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var models = require('../models')
var ShowType = models.showType
var ShowImage = models.showImage
var ShowPriceList = models.showPriceList

router.get('/show-type', (req, res, next) => {
  ShowType.findAll({
    include: [
      {
        model: ShowImage,
        attributes: ['id', 'url']
      }, {
        model: ShowPriceList,
        attributes: ['id', 'priceType', 'price']
      }
    ]
  }).then(showList => {
    res.status(200).send(showList)
  }).catch(err => {
    next(err)
  })
})

router.post('/show-type', (req, res, next) => {
  // upload seat map image, save url to seatMapUrl
  var seatMapUrl = req.body.seatMapUrl
  // create show type
  ShowType.create({
    name: req.body.showTypeName,
    seatMap: seatMapUrl
  }).then(newType => {
    Promise.all([
      // upload show images, create showImages for every url
      Promise.all(req.body.showImages.map(image => {
        ShowImage.create({
          url: image,
          showTypeId: newType.id
        })
      })),
      // create price list
      Promise.all(req.body.priceList.map(price => {
        ShowPriceList.create({
          showTypeId: newType.id,
          priceType: price.name,
          price: price.price
        })
      }))
    ]).then(resp => {
      ShowType.findOne({
        where: {
          id: newType.id
        },
        include: [
          {
            model: ShowImage,
            attributes: ['id', 'url']
          }, {
            model: ShowPriceList,
            attributes: ['id', 'priceType', 'price']
          }
        ]
      }).then(showList => {
        res.status(200).send(showList)
      }).catch(err => {
        next(err)
      })
    }).catch(err => {
      next(err)
    })
  }).catch(err => {
    next(err)
  })
})

router.delete('/show-type/:id', (req, res, next) => {
  var _id = req.params.id
  Promise.all([
    ShowType.destroy({
      where: {
        id: _id
      }
    }),
    ShowImage.destroy({
      where: {
        showTypeId: _id
      }
    }),
    ShowPriceList.destroy({
      where: {
        showTypeId: _id
      }
    })
  ]).then(resp => {
    res.status(200).send(true)
  }).catch(err => {
    next(err)
  })
})

router.get('/price-list', (req, res, next) => {
  ShowPriceList.findAll({
    attributes: [
      'id', 'priceType', 'price', 'showTypeId'
    ]
  }).then(resp => {
    res.status(200).send(resp)
  }).catch(err => {
    next(err)
  })
})
module.exports = router