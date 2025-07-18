require('dotenv').config()

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')


// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI
console.log(`Connecting to ${MONGODB_URI}`)
mongoose.set('strictQuery', false)
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
    favoriteGenre: String!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
`

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
      return book.populate('author')
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
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const config = {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    const authHeaderPrefix = 'Bearer '
    if (!auth || !auth.startsWith(authHeaderPrefix)) return {}
    const decodedToken = jwt.verify(auth.substring(authHeaderPrefix.length), process.env.JWT_SECRET)
    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}
startStandaloneServer(server, config).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})