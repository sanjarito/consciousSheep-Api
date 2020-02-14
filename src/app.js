require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const favorsRouter = require('./favors/favors-router')
const usersRouter = require('./users/users-router')
const authRouter = require('./auth/auth-router')
const {CLIENT_ORIGIN} = require('./config');
const {CLIENT_ORIGINAL} = require('./config');
const FavorsService = require('./favors-service')
const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

app.use(
  cors({
    origin: '*'
  })
);


app.get('/', (req, res) => {
   res.send('Hello, world!')
 })

 app.get('/api/', (req, res) => {
   res.send('Api call working');
 });

 app.get('/api/getfavors', (req, res) => {
     const knexInstance = req.app.get('db')
     FavorsService.getAllFavors(knexInstance)
       .then(favors => {
         res.json(favors)
       })
       .catch(next)

 });

app.use('/api/favors', favorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/auth', authRouter)




module.exports = app
