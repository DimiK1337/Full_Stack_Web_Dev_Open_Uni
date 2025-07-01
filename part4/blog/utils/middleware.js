
/**
 * This file handles all middleware in the project. The order of the middleware functions is important. The error handling must be used at the very end
 */

const logger = require('../utils/logger')
const morgan = require('morgan')

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})
const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  req.token = (!auth || !auth.startsWith('Bearer '))
    ? null
    : auth.replace('Bearer ', '')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'Malformed ID' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'token invalid' })
  }
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error) // Pass the error to the default express error handler middleware
}

module.exports = {
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}