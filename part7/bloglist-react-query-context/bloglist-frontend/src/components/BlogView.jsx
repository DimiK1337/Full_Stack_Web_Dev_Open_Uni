import { useState } from 'react'
import { useUserValue } from '../UserContext'


// This should be the `Blog` Component
const BlogView = ({ blog, handleDelete, handleLikeClick }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const user = useUserValue()
  const [visible, setVisible] = useState(false)
  const belongsToUser = user && blog.user && blog.user.username === user.username

  return (
    <div style={blogStyle}>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
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

export default BlogView