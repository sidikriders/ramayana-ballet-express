var router = require('express').Router()

var models = require('../models')
var Attraction = models.attraction
var TourPackage = models.tourPackage
var TpPrice = models.tpPrice
var TpDuration = models.tpDuration
var TourAttraction = models.tour_attraction

// get all tour packagges
router.get('/', (req, res, next) => {
  TourPackage.findAll({
    include: [
      'price',
      'duration',
      'includes'
    ]
  }).then(packages => {
    res.send(packages)
  }).catch(err => {
    next(err)
  })
})

// get one tour package
router.get('/:id', (req, res, next) => {
  TourPackage.findById(req.params.id, {
    include: [
      'price',
      'duration',
      'includes'
    ]
  }).then(package => {
    if (!package) {
      res.status(404).send('package not exist')
    } else {
      res.send(package)
    }
  }).catch(err => {
    next(err)
  })
})

// create one tour packages
router.post('/', (req, res, next) => {
  var b = req.body
  if (!b.name) {
    res.status(500).send('package name not defined')
  } else if (!b.nameEn) {
    res.status(500).send('package english name not defined')
  } else if (!b.rundown) {
    res.status(500).send('package rundown not defined')
  } else if (!b.rundownEn) {
    res.status(500).send('package english rundown  not defined')
  } else if (!b.minPax) {
    res.status(500).send('package min pax not defined')
  } else if (!b.price) {
    res.status(500).send('package price not defined')
  } else if (!b.price.price) {
    res.status(500).send('package price of price not defined')
  } else if (!b.price.type) {
    res.status(500).send('package type of price not defined')
  } else if (!b.duration) {
    res.status(500).send('package duration not defined')
  } else if (!b.duration.day) {
    res.status(500).send('package day of duration not defined')
  } else if (!b.duration.night) {
    res.status(500).send('package night of duration not defined')
  } else if (!b.includes) {
    res.status(500).send('package includes not defined')
  } else if (b.includes.length < 1) {
    res.status(500).send('package include dont have any attraction not defined')
  } else {
    // validasi each attraction id is exist
    Promise.all(
      b.includes.map(include => {
        return Attraction.findById(include).then(attr => {
          if (!attr) {
            return {
              status: false,
            }
          } else {
            return {
              status: true,
              data: 'Attraction with ID ' + include + ' doesn\'t exist'
            }
          }
        }).catch(err => {
          next(err)
        })
      })
    ).then(resp => {
      if (resp.find(res => !res.status)) {
        next(resp.filter(res => !re.status).map(res => res.data).join(', '))
      } else {
        next()
      }
    }).catch(err => {
      next(err)
    })
  }
},(req, res, next) => {
  var body = req.body
  // create initial package
  TourPackage.create({
    name: body.name,
    nameEn: body.nameEn,
    rundown: body.rundown,
    rundownEn: body.rundownEn,
    minPax: body.minPax
  }).then(tp => {
    var _price = body.price
    var _duration = body.duration
    var _includes = body.includes
    console.log(_includes)
    Promise.all([
      // create price
      TpPrice.create({
        price: _price.price,
        type: _price.type,
        tpId: tp.id
      }).then(newPrice => {
        return {
          status: true,
          data: newPrice
        }
      }).catch(err => {
        return {
          status: false,
          data: err
        }
      }),
      // create duration
      TpDuration.create({
        day: _duration.day,
        night: _duration.night,
        tpId: tp.id
      }).then(newDuration => {
        return {
          status: true,
          data: newDuration
        }
      }).catch(err => {
        return {
          status: false,
          data: err
        }
      }),
      // create includes
      Promise.all(_includes.map(attractionId => {
        return TourAttraction.create({
          tourPackageId: tp.id,
          attractionId: attractionId
        }).then(newTourAttraction => {
          return {
            status: true,
            data: newTourAttraction
          }
        }).catch(err => {
          return {
            status: false,
            data: err
          }
        })
      })).then(includes => {
        if (includes.find(include => !include.status)) {
          return {
            status: false,
            data: includes.filter(include => !include.status)
          }
        } else {
          return {
            status: true,
            data: includes.map(include => !include.data)
          }
        }
      }).catch(err => {
        return {
          status: false,
          data: err
        }
      })
    ]).then(resp => {
      console.log('\n\n', JSON.stringify(resp, null, 2))
      if (resp.find(res => !res.status)) {
        next(resp.filter(res => !res.status))
      } else {
        TourPackage.findById(tp.id, {
          include: [
            'price',
            'duration',
            'includes'
          ]
        }).then(package => {
          if (!package) {
            res.status(404).send('package not exist')
          } else {
            res.send(package)
          }
        }).catch(err => {
          next(err)
        })
      }
    }).catch(err => {
      next(err)
    })
  })
})

// delete one tour packages
router.delete('/:id', (req, res, next) => {
  var id = req.params.id
  Promise.all([
    TourPackage.destroy({
      where: {
        id: id
      }
    }),
    TourAttraction.destroy({
      where: {
        tourPackageId: id
      }
    }),
    TpPrice.destroy({
      where: {
        tpId: id
      }
    }),
    TpDuration.destroy({
      where: {
        tpId: id
      }
    })
  ]).then(resp => {
    res.send(true)
  }).catch(err => {
    next(err)
  })
})

module.exports = router