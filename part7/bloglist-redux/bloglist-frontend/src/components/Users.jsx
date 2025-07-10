import { useMemo } from 'react'

import { Link } from 'react-router-dom'

const Users = ({ blogs }) => {
  // Disable the new blog button while in the Users view

  // Store data about the users when the blog list changes
  const users = useMemo(() => {
    const userMap = new Map()
    //if (!blogs) return []
    blogs.forEach(blog => {
      const user = blog.user
      if (!userMap.has(user.id)) {
        userMap.set(user.id, { ...user, blogs: [blog] })
      }
      else {
        userMap.get(user.id).blogs.push(blog)
      }
    })
    return Array.from(userMap.values())
  }, [blogs])

  console.log('users ', users)

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