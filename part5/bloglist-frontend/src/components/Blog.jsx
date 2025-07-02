import { useState } from "react"

import blogsService from "../services/blogs"

const Blog = ({ blog, handleLikeClick }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  return (
    <div style={blogStyle}>
      {blog.title}

      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>

      {visible && (
        <div>
          <p>{blog.url}</p>
          <div>
            likes {blog.likes}
            <button onClick={handleLikeClick}>like</button>
          </div>
          <p>{blog.author}</p>
        </div>
      )}

    </div>
  )
}

export default Blog