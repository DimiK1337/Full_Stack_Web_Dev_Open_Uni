import { useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'

// Components
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

// Context API
import { ErrorContextProvider } from './ErrorContext'

// GraphQL
import { ALL_BOOKS, BOOK_ADDED } from './queries'
import { uniqByProp } from './utils'

const App = () => {
  const client = useApolloClient()
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded      
      notification(`New book: ${addedBook.title} by ${addedBook.author.name}`)

      // Update the cache for the books and authors
      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return { allBooks: uniqByProp(allBooks.concat(addedBook), "title") }
      })

      client.cache.updateQuery({ query: ALL_BOOKS, variables: { genre: '' } }, ({ allBooks }) => {
        return { allBooks: uniqByProp(allBooks.concat(addedBook), "title") }
      })
    }
  })

  const notification = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('library-user-token')
    client.clearStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token
          ? (
            <>
              <button onClick={() => setPage('add')}>add book</button>
              <button onClick={() => setPage('recommendations')}>recommendations</button>
              <button onClick={logout}>logout</button>
            </>
          )
          : (
            <button onClick={() => setPage('login')}>login</button>
          )
        }

      </div>

      {/* Created a context to pass the error message to different pages for GraphQL errors */}
      <ErrorContextProvider errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
        <Notification errorMessage={errorMessage} />

        <Authors show={page === 'authors'} token={token} />
        <Books show={page === 'books'} />
        <NewBook show={page === 'add'} />
        <Recommendations show={page === 'recommendations'} />
        <LoginForm
          show={page === 'login'}
          setToken={setToken}
          setErrorMessage={notification}
          setPage={setPage}
        />
      </ErrorContextProvider>

    </div>
  )
}

export default App
