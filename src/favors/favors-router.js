const path = require('path')
const express = require('express')
const xss = require('xss')
const FavorsService = require('./favors-service')
const favorsRouter = express.Router()
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const serializeFavor = favor => ({
    favor_title: xss(favor.favor_title),
    favor_category:favor.favor_category,
    favor_requester:favor.favor_requester,
    favor_fulfiller:favor.favor_fulfiller,
    favor_description:xss(favor.favor_description),
    favor_hoursrequired:favor.favor_hoursrequired,
    favor_id:favor.favor_id,
    favor_status:favor.favor_status,
  })

favorsRouter
.route('/')
.all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FavorsService.getAllFavors(knexInstance)
      .then(favors => {
        res.json(favors.map(serializeFavor))
      })
      .catch(next)
  })
  .post(jsonParser, (req,res,next) => {
    const { favor_id,favor_title,favor_category,favor_requester,favor_fulfiller,favor_description,favor_hoursrequired,favor_status } = req.body
    const newFavor = { favor_id,favor_title,favor_category,favor_requester,favor_fulfiller,favor_description,favor_hoursrequired,favor_status }
    for (const [key, value] of Object.entries(newFavor)) {
     if (value == null) {
       return res.status(400).json({
         error: { message: `Missing '${key}' in request body` }
       })
     }
   }
    FavorsService.insertFavor(
      req.app.get('db'),
      newFavor
    )
  .then(favor => {
    res
     .status(201)
     .location(path.posix.join(req.originalUrl, `/${favor.favor_id}`))
     .json(favor)
  })
     .catch(next)
  })

favorsRouter
.route('/:favor_id')
 .all(requireAuth)
   .all((req, res, next) => {
     FavorsService.getById(
       req.app.get('db'),
       req.params.favor_id
     )
       .then(favor => {
         if (!favor) {
           return res.status(404).json({
             error: { message: `Favor doesn't exist` }
           })
         }
         res.favor = favor
         next()
       })
       .catch(next)
   })

   .get((req, res, next) => {
      res.json(serializeFavor(res.favor))
     })

   .delete((req, res, next) => {
     FavorsService.deleteFavor(
       req.app.get('db'),
       req.params.favor_id
     )
     .then(() => {
       res.status(204).end()
     })
     .catch(next)
   })

   .patch(jsonParser, (req, res, next) => {
     const { favor_title,favor_category,favor_description  } = req.body
     const favorToUpdate = { favor_title, favor_category ,favor_description }
     FavorsService.updateFavor(
     req.app.get('db'),
     req.params.favor_id,
     favorToUpdate
   )
     .then(numRowsAffected => {
       res.status(204).end()
     })
     .catch(next)

   })


module.exports = favorsRouter
