import { Link } from 'react-router-dom'

import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = ({
  blogs,
  blogFormRef,
  handleCreateBlog
}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>

      <br />
      {
        <div>
          {
            [...blogs]
              .sort((a, b) => b.likes - a.likes)
              .map((blog) => (
                <div key={blog.id} style={blogStyle}>
                  <Link key={blog.id} to={`/blogs/${blog.id}`}>
                    {blog.title}
                  </Link>
                </div>
              ))
          }
        </div>
      }
    </div>
  )
}

export default BlogList