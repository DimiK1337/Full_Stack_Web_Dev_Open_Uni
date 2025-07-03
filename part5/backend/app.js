// This needs to be at the top of the file to remove the need for try/catch (middleware is handlded under the hood)
require('express-async-errors')

const express = require('express')
const mongoose = require('mongoose')

// Custom modules
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.json()) // Middleware to parse JSON bodies
app.use(express.static('dist'))

app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app


