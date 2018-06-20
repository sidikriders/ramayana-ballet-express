var router = require('express').Router()
var Op = require('sequelize').Op

var models = require('../models')
var ShowSchedule = models.showSchedule
var ShowType = models.showType
var ShowImages = models.showImage
var ShowPriceList = models.showPriceList

// get all active schedule
router.get('/', (req, res, next) => {
  ShowSchedule.findAll({
    where: {
      date: {
        [Op.gt]: new Date().getTime()
      }
    },
    include: {
      model: ShowType,
      attributes: ['name']
    }
  }).then(schedules => {
    res.status(200).send(schedules)
  }).catch(err => {
    next(err)
  })
})

// get one active schedule
router.get('/:id', (req, res, next) => {
  ShowSchedule.findOne({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: ShowType,
        attributes: ['id', 'name', 'seatMap'],
        include: [
          {
            model: ShowImages,
            attributes: ['id', 'url']
          }, {
            model: ShowPriceList,
            attributes: ['id', 'priceType', 'price']
          }
        ]
      }
    ]
  }).then(schedule => {
    if (!schedule) {
      res.status(400).send('schedule not exist')
    } else {
      res.status(200).send(schedule)
    }
  })
})

// create schedule
router.post('/', (req, res, next) => {
  var body = req.body
  if (!body.showTypeId) {
    res.status(500).send('show type not defined')
  } else if (!body.date) {
    res.status(500).send('date not defined')
  } else if (new Date(body.date).getTime() < new Date().getTime()) {
    res.status(500).send('date already past')
  } else {
    ShowType.findOne({
      where: {
        id: body.showTypeId
      },
      attributes: ['id'],
    }).then(showType => {
      if (!showType) {
        res.status(400).send('show type not exist')
      } else {
        Promise.all([
          ShowSchedule.create({
            date: new Date(body.date),
            showTypeId: showType.id
          }).then(newSchedule => {
            return {
              status: true,
              data: newSchedule
            }
          }).catch(err => {
            return {
              status: false,
              data: err
            }
          })
        ]).then(resp => {
          if (resp.filter(res => !res.status).length === 0) {
            var newSchedule = resp[0].data
            ShowSchedule.findOne({
              where: {
                id: newSchedule.id
              },
              include: [
                {
                  model: ShowType,
                  attributes: ['id', 'name', 'seatMap'],
                  include: [
                    {
                      model: ShowImages,
                      attributes: ['id', 'url']
                    }, {
                      model: ShowPriceList,
                      attributes: ['id', 'priceType', 'price']
                    }
                  ]
                }
              ]
            }).then(schedule => {
              res.status(200).send(schedule)
            }).catch(err => {
              next(err)
            })
          } else {
            next(resp.filter(res => !res.status)[0].data)
          }
        }).catch(err => {
          next(err)
        })
      }
    }).catch(err => {
      next(err)
    })
  }
})

module.exports = router