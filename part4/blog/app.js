// This needs to be at the top of the file to remove the need for try/catch (middleware is handlded under the hood)
require('express-async-errors')

const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const blogRouter = require('./controllers/blogs')

const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(result => {
    logger.info(`connected to mongo at URL:${mongoUrl}`)
  })
  .catch(error => {
    logger.error('mongo db conn error', error)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app