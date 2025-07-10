import { Link } from 'react-router-dom'

const User = ({ user }) => {
  if (!user) return null

  return (
    <div>
      <h3>Blogs created by — {user.name}</h3>
      <h4>Added blogs:</h4>
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