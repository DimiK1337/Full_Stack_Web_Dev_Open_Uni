import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

const BlogList = ({
  blogs,
  blogFormRef,
  createBlog,
  handleLikeClick,
  handleDelete
}) => {
  return (
    <div>
      <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
        <BlogForm createBlog={createBlog} />
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

export default BlogList