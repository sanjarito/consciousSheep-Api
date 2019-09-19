const path = require('path')
const express = require('express')
const xss = require('xss')
const FavorsService = require('./favors-service')
const favorsRouter = express.Router()
const jsonParser = express.json()

const serializeFavor = favor => ({
    title: favor.favor_title,
    description: favor.favor_description,

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
