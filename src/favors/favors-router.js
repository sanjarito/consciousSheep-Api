const path = require('path')
const express = require('express')
const xss = require('xss')
const FavorsService = require('./favors-service')
const favorsRouter = express.Router()
const jsonParser = express.json()


favorsRouter
.route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FavorsService.getAllFavors(knexInstance)
      .then(favors => {
        res.json(favors)
      })
      .catch(next)
  })

module.exports = favorsRouter
