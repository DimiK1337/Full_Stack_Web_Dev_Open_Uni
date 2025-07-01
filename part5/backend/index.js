const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}\nURL: http://localhost:${config.PORT}/`)
  logger.info(`API endpoint: http://localhost:${config.PORT}/api/notes`)
})