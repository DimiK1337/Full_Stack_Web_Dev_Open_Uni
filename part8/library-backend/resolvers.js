
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')

const { PubSub } = require('graphql-subscriptions')
const pubSub = new PubSub()

const resolvers = {
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      if (!author) {
        throw new GraphQLError(`Author ${root.name} not found`, {
          code: 'BAD_USER_INPUT',
          invalidArgs: root.name
        })
      }
      return await Book.countDocuments({ author: author._id })
    }
  },
  Book: {
    author: async (root) => await Author.findById(root.author)
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      // Check if author exists, if not add to DB
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })
      }
      await author.save()

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      }
      catch (error) {
        throw new GraphQLError('Failed saving book', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      const populatedBook = await book.populate('author')
      pubSub.publish('BOOK_ADDED', { bookAdded: populatedBook })
      return populatedBook
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      const updatedAuthor = await Author.findByIdAndUpdate(author.id, { born: args.setBornTo }, { new: true, runValidators: true })
      return updatedAuthor
    },

    // Auth resolvers 

    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user
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
    }
  },

  Query: {
    me: async (root, args, context) => context.currentUser,
    bookCount: async (root) => await Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (!author) {
          throw new GraphQLError(`Author '${args.author}' not found`, {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author
          })
        }
        filter.author = author
      }
      if (args.genre) {
        filter.genres = args.genre
      }

      // This avoids the N+1 queries problem, where every author would have to be resolved when making this single query
      return await Book.find(filter).populate('author')
    },
    authorCount: async (root) => await Author.collection.countDocuments(),
    allAuthors: async (root, args) => await Author.find({})
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers