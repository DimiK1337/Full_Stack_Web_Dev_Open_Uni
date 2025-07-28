const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Person = require('./models/Person')
const User = require('./models/User')

const { PubSub } = require('graphql-subscriptions')
const pubSub = new PubSub()

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      //console.log('Person.find')
      if (!args.phone) return await Person.find({}).populate('friendOf')
      return await Person.find({ phone: { $exists: args.phone === 'YES' } }).populate('friendOf')
    },
    findPerson: async (root, args) => await Person.findOne({ name: args.name }),

    me: async (root, args, context) => context.currentUser
  },
  Person: {
    address: (root) => ({
      street: root.street,
      city: root.city
    }),

    /* friendOf: async (root) => {
      console.log('User.find')
      return await User.find({ friends: { $in: [root._id] } })
    } */
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

      pubSub.publish('PERSON_ADDED', { personAdded: person })
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
  },

  Subscription: {
    personAdded: {
      subscribe: () => pubSub.asyncIterableIterator('PERSON_ADDED')
    }
  }

}

module.exports = resolvers