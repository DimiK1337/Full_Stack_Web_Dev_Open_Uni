import PropTypes from 'prop-types'
import { useState } from 'react'

import blogService from '../services/blogs'

const BlogForm = ({ addBlogToList }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleCreate = async event => {
    event.preventDefault()
    try {
      const newBlog = await blogService.createBlog({ title, author, url })
      addBlogToList(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
    }
    catch (error) {
      console.error('Error creating blog:', error)
    }
  }

  return (
    <>
      <h2>Create new blog</h2>
      <form>
        <div>
          title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author: <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url: <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type='submit' onClick={handleCreate}>create</button>
      </form>
    </>
  )
}

BlogForm.PropTypes = {
  addBlogToList: PropTypes.func.isRequired
}

export default BlogForm