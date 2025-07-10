import { useSelector, useDispatch } from 'react-redux'
import useField from '../hooks/useField'
import { addComment } from '../reducers/blogReducer'

const Blog = ({ blog, handleLikeClick, handleDelete }) => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.user)

  const commentInput = useField('text')
  const belongsToUser = loggedInUser && blog.user && blog.user.username === loggedInUser.username

  const handleSubmitComment = async (event) => {
    event.preventDefault()
    dispatch(addComment(blog.id, commentInput.value))
    commentInput.onChange({ target: { value: '' } }) // Clear input form
  }

  return (
    <div>
      <div className="blog">
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
      <div className='comments'>
        <h3>Comments:</h3>
        <form onSubmit={handleSubmitComment}>
          <input {...commentInput} />
          <button type="submit">add comment</button>
        </form>
        <ul>
          {blog.comments.map((comment, index) =>
            <li key={`${index}-${comment}`}>
              {comment}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Blog
