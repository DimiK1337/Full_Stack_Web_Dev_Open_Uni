import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import useUserMap from '../hooks/useUserMap'

const Users = ({ blogs }) => {

  const users = useUserMap(blogs)
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th><em>blogs created</em></th>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td>
                <Link to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </td>
              <td>
                {user.blogs.length}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

}

export default Users