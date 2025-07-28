import { useState, useContext } from 'react'
import { useMutation } from '@apollo/client'

import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries'
import ErrorContext from '../ErrorContext'
import { uniqByProp } from '../utils'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [, setErrorMessage] = useContext(ErrorContext)

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      setErrorMessage(error.message)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    },
    update: (cache, response) => {
      const addedBook = response.data.addBook

      cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return { allBooks: uniqByProp(allBooks.concat(addedBook), 'title') }
      })
      
      cache.updateQuery({ query: ALL_BOOKS, variables: { genre: '' } }, ({ allBooks }) => {
        return { allBooks: uniqByProp(allBooks.concat(addedBook), 'title') }
      })

      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        const authorExists = allAuthors.find(a => a.name === addedBook.author.name)
        if (!authorExists) return { allAuthors: allAuthors.concat(addedBook.author) }

        const updatedAuthors = allAuthors.map(a =>
          a.name !== addedBook.author.name
            ? a
            : { ...a, bookCount: a.bookCount + 1 }
        )

        return { allAuthors: updatedAuthors }
      })
    }
  })

  if (!props.show) return null

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: { title, author, published: Number(published), genres } })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook