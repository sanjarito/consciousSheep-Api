const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const usersRouter = express.Router()
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')

const serializeUser = user => ({
    user_about: xss(user.user_about),
    user_email:user.user_email,
    user_zipcode:user.user_zipcode,
    user_favortokens:user.user_favortokens,
    user_id:user.user_id
  })

usersRouter
.route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    UsersService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser))
      })
      .catch(next)
  })
  .post(jsonParser, (req,res,next) => {
    const { user_id,user_email,user_password,user_zipcode,user_about,user_favortokens} = req.body
    const newUser = { user_id,user_email,user_password,user_zipcode,user_about,user_favortokens }
    for (const [key, value] of Object.entries(newUser)) {
     if (value == null) {
       return res.status(400).json({
         error: { message: `Missing '${key}' in request body` }
       })
     }
   }
    UsersService.insertUser(
      req.app.get('db'),
      newUser
    )
  .then(user => {
    res
     .status(201)
     .location(path.posix.join(req.originalUrl, `/${user.user_id}`))
     .json(user)
  })
     .catch(next)
  })

usersRouter
.route('/:user_id')
  .all(requireAuth)
   .all((req, res, next) => {
     UsersService.getById(
       req.app.get('db'),
       req.params.user_id
     )
       .then(user => {
         if (!user) {
           return res.status(404).json({
             error: { message: `User doesn't exist` }
           })
         }
         res.user = user
         next()
       })
       .catch(next)
   })

   .get((req, res, next) => {
      res.json(serializeUser(res.user))
     })

   .delete((req, res, next) => {
     UsersService.deleteUser(
       req.app.get('db'),
       req.params.user_id
     )
     .then(() => {
       res.status(204).end()
     })
     .catch(next)
   })

   .patch(jsonParser, (req, res, next) => {
     const { user_about,user_zipcode,user_favortokens  } = req.body
     const userToUpdate = { user_about,user_zipcode,user_favortokens }
     UsersService.updateUser(
     req.app.get('db'),
     req.params.user_id,
     userToUpdate
   )
     .then(numRowsAffected => {
       res.status(204).end()
     })
     .catch(next)

   })


module.exports = usersRouter
