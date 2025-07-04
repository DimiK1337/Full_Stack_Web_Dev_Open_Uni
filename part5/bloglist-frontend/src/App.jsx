import { useState, useEffect, useRef } from 'react'

import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'


import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  // State
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Refs
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedInJSON) return
    const user = JSON.parse(loggedInJSON)
    setUser(user)
    blogService.setToken(user.token)

  }, [])

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername(username)
      setPassword(password)
    }
    catch (exception) {
      setErrorMessage({ message: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')

    setUser(null)
    setUsername('')
    setPassword('')
  }

  const createBlog = async blog => {
    const newBlog = await blogService.createBlog(blog)
    setBlogs(blogs.concat(newBlog))
    blogFormRef.current.toggleVisibility()

    setErrorMessage({
      message: `Added a new blog titled '${newBlog.title}' by '${blog.author}'`,
      type: 'success'
    })
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleLikeClick = async (blogToUpdate) => {
    const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1, user: blogToUpdate.user.id }
    const updatedBlog = await blogService.updateBlog(blogToUpdate.id, newBlog)
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  // Handle delete
  const handleDelete = async (blogToDelete) => {
    const deleteOk = window.confirm(`delete blog ${blogToDelete.title}`)
    if (!deleteOk) return
    await blogService.deleteBlog(blogToDelete.id)
    setBlogs(blogs.filter(blog => blogToDelete.id !== blog.id))
  }

  const blogDisplay = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
        </Togglable>

        <br />
        {
          blogs.sort((a, b) => b.likes - a.likes).map(blog =>
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              handleLikeClick={() => handleLikeClick(blog)}
              handleDelete={() => handleDelete(blog)}
            />
          )
        }
      </>
    )
  }

  return (
    <div>
      <Notification messageObj={errorMessage} />
      {
        user === null
          ? <Togglable buttonLabel={'login'}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
          : blogDisplay()
      }
    </div>
  )
}

export default App