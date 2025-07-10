import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogDisplay = ({
  blogs,
  blogFormRef,
  handleCreateBlog,
  handleLikeClick,
  handleDelete
}) => {

  return (
    <div>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm handleCreateBlog={handleCreateBlog} />
      </Togglable>

      <br />
      {
        [...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              handleLikeClick={() => handleLikeClick(blog)}
              handleDelete={() => handleDelete(blog)}
            />
          ))
      }
    </div>
  )
}

export default BlogDisplay