import { Link } from 'react-router-dom'

const User = ({ user }) => {
  if (!user) return null

  return (
    <div>
      <h1>Blogs created by — {user.name}</h1>
      <h2>Added blogs:</h2>
      <ul>
        {user.blogs.map(blog =>
          <div key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </div>
        )}
      </ul>
    </div>
  )
}

export default User