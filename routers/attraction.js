var router = require('express').Router()

var attractionGroupController = require('./attraction-group.js')
var models = require('../models')
var Attraction = models.attraction
var AttractionGroup = models.attractionGroup
var AttractionImage = models.attractionImage
var Tag = models.tag
var TagAttraction = models.tag_attraction

// routing for group
router.use('/group', attractionGroupController)

// get all attraction
router.get('/', (req, res, next) => {
  Attraction.findAll({
    include: [
      {
        model: AttractionGroup,
        attributes: ['id', 'name', 'nameEn']
      }, {
        model: AttractionImage,
        attributes: ['id', 'url', 'title', 'titleEn']
      }, 'tags'
    ]
  }).then(attractions => {
    res.status(200).send(attractions)
  }).catch(err => {
    next(err)
  })
})

// create one attraction
router.post('/', (req, res, next) => {
  var body = req.body
  if (!body.name) {
    res.status(500).send('name not defined')
  } else if (!body.nameEn) {
    res.status(500).send('name english not defined')
  } else if (!body.shortDesc) {
    res.status(500).send('short description not defined')
  } else if (!body.shortDescEn) {
    res.status(500).send('short description english not defined')
  } else if (!body.desc) {
    res.status(500).send('description not defined')
  } else if (!body.descEn) {
    res.status(500).send('description english not defined')
  } else if (!body.groupId) {
    res.status(500).send('group not selected')
  } else if (!body.images || body.images.length < 1) {
    res.status(500).send('images must exist')
  } else {
    AttractionGroup.findOne({
      where: {
        id: body.groupId
      }
    }).then(group => {
      if (!group) {
        res.status(500).send('group not exist')
      } else {
        Attraction.create({
          name: body.name,
          nameEn: body.nameEn,
          shortDesc: body.shortDesc,
          shortDescEn: body.shortDescEn,
          desc: body.desc,
          descEn: body.descEn,
          attractionGroupId: body.groupId
        }).then(newAttraction => {
          Promise.all([
            // create attraction images
            Promise.all(body.images.map((img, idx) => {
              return AttractionImage.create({
                title: img.title || 'Foto ' + (idx + 1) + ' ' + newAttraction.name,
                titleEn: img.titleEn || 'Picture ' + (idx + 1) + ' of ' + newAttraction.nameEn,
                url: img.url,
                attractionId: newAttraction.id
              }).then(image => {
                return {
                  status: true,
                  data: image
                }
              }).catch(err => {
                return {
                  status: false,
                  data: err
                }
              })
            })).then(image => {
              if (image.filter(img => !img.status).length > 0) {
                return image.filter(img => !img.status)[0]
              } else {
                return {
                  status: true,
                  data: image.map(img => img.data)
                }
              }
            }),
            // create attraction tags
            Promise.all(body.tags.map(tagId => {
              return Tag.findOne({
                where: {
                  id: tagId
                }
              }).then(tag => {
                if (!tag) {
                  return {
                    status: false,
                    data: 'tag not exist'
                  }
                } else {
                  return TagAttraction.create({
                    attractionId: newAttraction.id,
                    tagId: tag.id
                  }).then(newTag => {
                    return {
                      status: true,
                      data: newTag
                    }
                  }).catch(err => {
                    return {
                      status: false,
                      data: err
                    }
                  })
                }
              }).catch(err => {
                return {
                  status: false,
                  data: err
                }
              })
            })).then(tagList => {
              if (tagList.filter(tag => !tag.status).length > 0) {
                return tagList.filter(tag => !tag.status)[0]
              } else {
                return {
                  status: true,
                  data: tagList.map(tag => tag.data)
                }
              }
            }).catch(err => {
              return {
                status: false,
                data: err
              }
            })
          ]).then(response => {
            Attraction.findOne({
              where: {
                id: newAttraction.id
              },
              include: [
                {
                  model: AttractionImage,
                  attributes: ['id', 'url', 'title', 'titleEn']
                }, {
                  model: AttractionGroup,
                  attributes: ['name', 'nameEn']
                }, 'tags'
              ]
            }).then(attr => {
              console.log('\n\nattr', JSON.stringify(attr, null, 2))
              res.status(200).send(attr)
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
  }
})

// get one attraction
router.get('/:id', (req, res, next) => {
  Attraction.findById(req.params.id, {
    include: [
      {
        model: AttractionGroup,
        attributes: ['id', 'name', 'nameEn']
      }, {
        model: AttractionImage,
        attributes: ['id', 'url', 'title', 'titleEn']
      }, 'tags'
    ]
  }).then(attraction => {
    if (!attraction) {
      res.status(404).send('attraction not exist')
    } else {
      res.send(attraction)
    }
  }).catch(err => {
    next(err)
  })
})

// delete one attraction
router.delete('/:id', (req, res, next) => {
  var id = req.params.id
  Promise.all([
    Attraction.destroy({
      where: {
        id: id
      }
    }).then(() => { return { status: true } }).catch(err => { return { status: false, data: err } }),
    AttractionImage.destroy({
      where: {
        attractionId: id
      }
    }).then(() => { return { status: true } }).catch(err => { return { status: false, data: err } }),
    TagAttraction.destroy({
      where: {
        attractionId: id
      }
    }).then(() => { return { status: true } }).catch(err => { return { status: false, data: err } })
  ]).then(resp => {
    var errorResp = resp.filter(res => !res.status)
    if (errorResp.length > 0) {
      next(errorResp[0].data)
    } else {
      res.send(true)
    }
  }).catch(err => {
    next(err)
  })
})

module.exports = router;