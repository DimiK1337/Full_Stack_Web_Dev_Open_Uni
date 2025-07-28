import { gql } from '@apollo/client'

const AUTHOR_DETAILS_FRAGMENT = gql`
  fragment AuthorDetails on Author {
    name
    born
    bookCount
  }
`

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      ...AuthorDetails
    }
  }
  ${AUTHOR_DETAILS_FRAGMENT}
`

const BOOK_DETAILS_FRAGMENT = gql`
  fragment BookDetails on Book {
    title
    author {
      name
      born
    }
    published
    genres
  }
`

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAGMENT}
`

const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ){
    addBook(
      title: $title, 
      author: $author, 
      published: $published, 
      genres: $genres
    ){
      ...BookDetails
    }
  }

  ${BOOK_DETAILS_FRAGMENT}
`

const EDIT_AUTHOR = gql`
  mutation editAuthor(
    $name: String!,
    $setBornTo: Int!
  ){
    editAuthor(name: $name, setBornTo: $setBornTo){
      ...AuthorDetails 
    }
  }

  ${AUTHOR_DETAILS_FRAGMENT}
`

const ME = gql`
  query currentUser {
    me {
      username,
      favoriteGenre
    }
  }
`

// Auth mutations

const CREATE_USER = gql`
  mutation createUser(
    $username: String!
    $favoriteGenre: String!
  ){
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
        username,
        favoriteGenre
      }
    }
`

const LOGIN = gql`
  mutation login(
    $username: String!
    $password: String!
  ){
    login(username: $username, password: $password) {
        value
      }
    }
`

// Subscriptions

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  ${BOOK_DETAILS_FRAGMENT}
`

export {
  // Queries
  ALL_AUTHORS,
  ALL_BOOKS,
  ME,

  // Mutations
  CREATE_BOOK,
  EDIT_AUTHOR,
  CREATE_USER,
  LOGIN,

  // Subscriptions
  BOOK_ADDED
}