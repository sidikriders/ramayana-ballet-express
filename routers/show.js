var router = require('express').Router()
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')

var models = require('../models')
var ShowType = models.showType
var ShowImage = models.showImage
var ShowPriceList = models.showPriceList
var seatList = models.seatList

// get all showtype
router.get('/show-type', (req, res, next) => {
  ShowType.findAll({
    include: [
      {
        model: ShowImage,
        attributes: ['id', 'url']
      }, {
        model: ShowPriceList,
        attributes: ['id', 'priceType', 'price']
      }, {
        model: seatList,
        attributes: ['id', 'row', 'column']
      }
    ]
  }).then(showList => {
    res.status(200).send(showList)
  }).catch(err => {
    next(err)
  })
})

// create show type
// upload image of seat map
// upload show type pictures (ini foto2 suasana show type nya)
// create price list
router.post('/show-type', (req, res, next) => {
  // upload seat map image, save url to seatMapUrl
  var seatMapUrl = req.body.seatMapUrl

  // check if all requirements is there
  if (!req.body.showTypeName) {
    res.status(500).send('show type name not defined')
  } else if (!seatMapUrl) {
    res.status(500).send('seat map url not defined')
  } else if (!req.body.showImages || req.body.showImages.length < 1) {
    res.status(500).send('show images not defined')
  } else if (!req.body.priceLists) {
    res.status(500).send('price list not defined')
  } else if (!req.body.seatLists || req.body.seatLists.length < 1) {
    res.status(500).send('seat list not defined')
  } else {
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
        Promise.all(req.body.priceLists.map(price => {
          ShowPriceList.create({
            showTypeId: newType.id,
            priceType: price.name,
            price: price.price
          })
        })),
        Promise.all(req.body.seatLists.map(seat) => {
          seatList.create({
            showTypeId: newType.id,
            row: seat.row,
            column: seat.column
          })
        })
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
            }, {
              model: seatList,
              attributes: ['id', 'row', 'column']
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
  }
})

// delete show type
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

// get all price list
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