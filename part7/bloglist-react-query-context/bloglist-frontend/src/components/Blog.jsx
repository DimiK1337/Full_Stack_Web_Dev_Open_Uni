import { useMutation, useQueryClient } from '@tanstack/react-query'

import useField from '../hooks/useField'
import { useUserValue } from '../UserContext'

import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeClick, handleDelete }) => {
  const queryClient = useQueryClient()

  const loggedInUser = useUserValue()
  const belongsToUser = loggedInUser && blog.user && blog.user.username === loggedInUser.username

  const commentInput = useField('text')
  const addCommentMutation = useMutation({
    mutationFn: async ({ id, comment }) => await blogService.addComment(id, comment),
    onSuccess: (updatedBlog) => {
      const currentBlogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], currentBlogs.map((blog) => (blog.id === updatedBlog.id ? updatedBlog : blog)))
    }
  })


  const handleSubmitComment = async (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ id: blog.id, comment: commentInput.value })
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

