import { useSelector } from 'react-redux'

// TODO: Fix the props
const Blog = ({ blog, handleLikeClick, handleDelete }) => {
  const loggedInUser = useSelector(state => state.user)
  const belongsToUser = loggedInUser && blog.user && blog.user.username === loggedInUser.username

  console.log('blog check after refresh', blog)
  console.log('logged in user', loggedInUser)

  return (
    <div   className="blog">
      <h2>{blog.title}</h2>
      <div>
        <p className="url">{blog.url}</p>
        <div className="likes">
          likes {blog.likes}
          <button onClick={handleLikeClick}>like</button>
        </div>
        <div className='author'>
          added by {blog.author}
        </div>
        {belongsToUser && <button onClick={handleDelete}>delete</button>}
      </div>

    </div>
  )
}

export default Blog
