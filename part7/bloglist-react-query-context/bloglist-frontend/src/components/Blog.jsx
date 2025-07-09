import { useState } from 'react'

const Blog = ({ blog, user, handleLikeClick, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [visible, setVisible] = useState(false)
  const belongsToUser = blog.user && blog.user.username === user.username

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible && (
        <div>
          <p className="url">{blog.url}</p>
          <div className="likes">
            likes {blog.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          {belongsToUser && <button onClick={handleDelete}>delete</button>}
        </div>
      )}
    </div>
  )
}

export default Blog
