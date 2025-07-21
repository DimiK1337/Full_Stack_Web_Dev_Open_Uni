import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ME } from '../queries'

const Recommendations = ({ show }) => {

  const booksResult = useQuery(ALL_BOOKS)
  const currentUserResult = useQuery(ME)

  if (!show) return null

  if (booksResult.loading) return <div>Loading books...</div>
  if (currentUserResult.loading) return <div>Loading current user data...</div>

  const books = booksResult.data.allBooks
  const favoriteGenre = currentUserResult.data.me.favoriteGenre
  
  return (
    <div>
      <h2>recommendations</h2>

      {<p> books in your favorite genre <b>{favoriteGenre}</b></p>}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.filter(b => b.genres.includes(favoriteGenre)).map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default Recommendations