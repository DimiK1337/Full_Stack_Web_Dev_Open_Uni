import { useState } from 'react'
import PropTypes from 'prop-types'

import { Form, Button } from 'react-bootstrap'

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
      <Form>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            id="title-input"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            id="author-input"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            id="url-input"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Form.Group>
        <Button variant='primary' type="submit" onClick={handleCreate}>
          create
        </Button>
      </Form>
    </>
  )
}

BlogForm.propTypes = {
  handleCreateBlog: PropTypes.func.isRequired,
}

export default BlogForm
