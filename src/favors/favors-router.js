const path = require('path')
const express = require('express')
const xss = require('xss')
const FavorsService = require('./notes-service')
const favorsRouter = express.Router()
const jsonParser = express.json()


favorsRouter
.route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })

module.exports = favorsRouter
