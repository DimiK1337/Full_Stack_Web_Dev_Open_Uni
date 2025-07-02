import { useState } from "react"

const Blog = ({ blog }) => {
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
            <button>like</button>
          </div>
          <p>{blog.author}</p>
        </div>
      )}

    </div>
  )
}

export default Blog