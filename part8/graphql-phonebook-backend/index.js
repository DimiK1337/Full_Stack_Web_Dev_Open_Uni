require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')

// Mongo connection
const mongoose = require('mongoose')
const Person = require('./models/Person')
const User = require('./models/User')

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log(`Connecting to ${MONGODB_URI}`)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



// GraphQL

const typeDefs = `
  type User {
    id: ID!
    username: String!
    friends: [Person!]!
  }
  
  type Token {
    value: String!
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(
      name: String!
      phone: String!
    ): Person

    createUser(
      username: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    addAsFriend(
      name: String!
    ): User
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
    me: User
  }
`

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) return await Person.find({})
      return await Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => await Person.findOne({ name: args.name }),

    me: async (root, args, context) => context.currentUser
  },
  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city
    })
  },
  Mutation: {
    addPerson: async (root, args, context) => {
      const person = new Person({ ...args })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      try {
        await person.save()
        currentUser.friends = currentUser.friends.concat(person)
        await currentUser.save()
      }
      catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return person
    },

    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if (!person) return null
      person.phone = args.phone

      try {
        await person.save()
      }
      catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return person
    },

    // login resolvers
    createUser: async (root, args) => {
      const user = new User({ username: args.username })
      return await user
        .save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },

    // Authenticated functionality

    addAsFriend: async (root, args, { currentUser }) => {
      const isFriend = person => currentUser.friends.map(f => f._id.toString()).includes(person._id.toString())

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          code: 'BAD_USER_INPUT'
        })
      }

      const person = await Person.findOne({ name: args.name })
      if (!isFriend(person)) {
        currentUser.friends = currentUser.friends.concat(person)
      }
      await currentUser.save()

      return currentUser
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers })

const config = {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    const authHeaderPrefix = 'Bearer '
    if (!auth || !auth.startsWith(authHeaderPrefix)) return {}
    const decodedToken = jwt.verify(auth.substring(authHeaderPrefix.length), process.env.JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id).populate('friends')
    return { currentUser }
  }
}

startStandaloneServer(server, config)
  .then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })