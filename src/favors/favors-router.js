const path = require('path')
const express = require('express')
const xss = require('xss')
const FavorsService = require('./favors-service')
const favorsRouter = express.Router()
const jsonParser = express.json()

const serializeFavor = favor => ({
    favor_title: favor.favor_title,
    favor_category:favor.favor_category,
    favor_description:favor.favor_description,
    favor_hoursrequired:favor.favor_hoursrequired,
    favor_id:favor.favor_id,
    favor_status:favor.favor_status,
  })

favorsRouter
.route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FavorsService.getAllFavors(knexInstance)
      .then(favors => {
        res.json(favors.map(serializeFavor))
      })
      .catch(next)
  })

module.exports = favorsRouter
