require('dotenv').config()

const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')

const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')


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

let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

const typeDefs = `
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
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
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
    addBook: async (root, args) => {
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

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) return null
      const updatedAuthor = await Author.findByIdAndUpdate(author.id, { born: args.setBornTo }, { new: true, runValidators: true })
      return updatedAuthor
    }
  },
  Query: {
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
}
startStandaloneServer(server, config).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})