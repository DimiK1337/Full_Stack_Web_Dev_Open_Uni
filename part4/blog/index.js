const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

const PORT = config.PORT
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`URL: http://localhost:${PORT}/`)
  logger.info(`API ENDPOINT: http://localhost:${PORT}/api/blogs`)
})