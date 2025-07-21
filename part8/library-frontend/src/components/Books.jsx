import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const [genre, setGenre] = useState('')

  const allBooksResult = useQuery(ALL_BOOKS)
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genre }
  })

  if (!props.show) return null

  if (filteredBooksResult.loading || allBooksResult.loading) return <div>Loading books...</div>

  const allBooks = allBooksResult.data.allBooks
  const filteredBooks = filteredBooksResult.data.allBooks
  console.log('books in Books comp', filteredBooks)

  const uniqueGenres = allBooks.reduce((acc, cur) => {
    cur.genres.forEach(genre => {
      if (!acc.includes(genre)) acc.unshift(genre)
    })
    return acc
  }, ['all-genres'])

  
  return (
    <div>
      <h2>books</h2>

      {(genre !== 'all-genres' && genre !== '') && <p>in genre <b>{genre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {uniqueGenres.map(genre =>
          <button 
            key={genre}
            value={genre}
            onClick={({ target }) => setGenre(target.value === 'all-genres' ? '' : target.value)}
          >
            {genre}
          </button>
        )}
      </div>
    </div>
  )
}

export default Books
