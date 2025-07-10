import PropTypes from 'prop-types'
import { useState } from 'react'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      handleCreateBlog({ title, author, url })
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form>
        <div>
          title:{' '}
          <input
            id="title-input"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:{' '}
          <input
            id="author-input"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:{' '}
          <input
            id="url-input"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" onClick={handleCreate}>
          create
        </button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired,
}

export default BlogForm
