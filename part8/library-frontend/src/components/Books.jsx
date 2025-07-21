import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS } from '../queries'

const Books = (props) => {

  const [genre, setGenre] = useState('all-genres')
  const result = useQuery(ALL_BOOKS)

  if (!props.show) return null

  if (result.loading) return <div>Loading books...</div>

  const books = result.data.allBooks
  console.log('books in Books comp', books)

  const uniqueGenres = books.reduce((acc, cur) => {
    cur.genres.forEach(genre => {
      if (!acc.includes(genre)) acc.unshift(genre)
    })
    return acc
  }, ['all-genres'])


  const filteredBooks = (genreFilter) => {
    if (!uniqueGenres.includes(genreFilter) || genreFilter === 'all-genres') return books
    return books.filter(b => b.genres.includes(genreFilter))
  }
  
  return (
    <div>
      <h2>books</h2>

      {(genre !== 'all-genres') && <p>in genre <b>{genre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredBooks(genre).map((b) => (
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
            onClick={({ target }) => setGenre(target.value)}
          >
            {genre}
          </button>
        )}
      </div>
    </div>
  )
}

export default Books
