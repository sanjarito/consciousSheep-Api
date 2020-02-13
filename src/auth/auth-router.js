const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const bcrypt = require('bcryptjs')
const { requireAuth } = require('../middleware/jwt-auth')
const saltRounds = 2;

authRouter
   .post('/login', jsonBodyParser, (req, res, next) => {
     const { user_email, user_password } = req.body
     const loginUser = { user_email, user_password }


     for (const [key, value] of Object.entries(loginUser))
       if (value == null)
         return res.status(400).json({
           error: `Missing '${key}' in request body`
         })

          AuthService.getUserWithUserName(
          req.app.get('db'),
          loginUser.user_email
          )
          .then(dbUser => {
            if (!dbUser)
              return res.status(400).json({
                error: 'Incorrect user_email or user_password',
          })
          if (user_email === dbUser.user_email && user_password === dbUser.user_password) {
            const sub = dbUser.user_email
            const payload = { user_id: dbUser.user_id }
            res.send({
            authToken: AuthService.createJwt(sub, payload)
            })
          } else {
            return res.status(400).json({
                error: 'Incorrect user_email or password',
              })
          }

           })
        .catch(next)
      })

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_email
  const payload = { user_id: req.user.user_id }
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  })
})

module.exports = authRouter
