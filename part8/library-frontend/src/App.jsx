import { useState } from 'react'

// Components
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Notification from './components/Notification'

// Context API
import { ErrorContextProvider } from './ErrorContext'

const App = () => {
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState('')

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
      </div>

      {/* Created a context to pass the error message to different pages for GraphQL errors */}
      <ErrorContextProvider errorMessage={errorMessage} setErrorMessage={setErrorMessage}>
        <Notification errorMessage={errorMessage} />
        <Authors show={page === 'authors'} />
        <Books show={page === 'books'} />
        <NewBook show={page === 'add'} />
      </ErrorContextProvider>

    </div>
  );
};

export default App;
