require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const cors = require('cors')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const jwt = require('jsonwebtoken')

// Mongo connection
const mongoose = require('mongoose')
const User = require('./models/User')

mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.MONGODB_URI
console.log(`Connecting to ${MONGODB_URI}`)

mongoose.set('debug', true)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  // This inline plugin ensures that WS server is shutdown, the HTTP server is handled by the official plugin
  const gracefulWebSocketServerShutdownPlugin = {
    async serverWillStart() {
      return {
        async drainServer() {
          serverCleanup.dispose()
        }
      }
    }
  }

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      gracefulWebSocketServerShutdownPlugin
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        const authHeaderPrefix = 'Bearer '
        if (!auth || !auth.startsWith(authHeaderPrefix)) return {}
        const decodedToken = jwt.verify(auth.substring(authHeaderPrefix.length), process.env.JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id).populate('friends')
        return { currentUser }
      }
    })
  )

  const PORT = 4000
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`)
  })
}

start()