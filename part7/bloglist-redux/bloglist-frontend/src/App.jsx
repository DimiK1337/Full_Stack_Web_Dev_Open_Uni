import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Routes, Route, Link
} from 'react-router-dom'

// Components
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Users from './components/Users'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

// Reducers
import { showAndHideNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, incrementLike, deleteBlog } from './reducers/blogReducer'
import { setUser, removeUser } from './reducers/userReducer'

const App = () => {
  const dispatch = useDispatch()

  // State
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Refs
  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedInJSON) return
    const loggedInUser = JSON.parse(loggedInJSON)
    dispatch(setUser(loggedInUser))
    blogService.setToken(loggedInUser.token)
  }, [dispatch])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      dispatch(setUser(loggedInUser))
      setUsername(username)
      setPassword(password)

    } catch (exception) {
      dispatch(showAndHideNotification('Wrong credentials', 'error'))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch(removeUser())
    setUsername('')
    setPassword('')
  }

  const handleCreateBlog = async (blog) => {
    dispatch(createBlog(blog))
    blogFormRef.current.toggleVisibility()
    dispatch(showAndHideNotification(`Added a new blog titled '${blog.title}' by '${blog.author}'`))
  }

  const handleLikeClick = async (blogToUpdate) => {
    dispatch(incrementLike(blogToUpdate))
  }

  // Handle delete
  const handleDelete = async (blogToDelete) => {
    const deleteOk = window.confirm(`delete blog ${blogToDelete.title}`)
    if (!deleteOk) return
    dispatch(deleteBlog(blogToDelete.id))
  }

  // Custom Routes
  const blogListProps = {
    blogs,
    blogFormRef,
    createBlog,
    handleLikeClick,
    handleDelete
  }

  console.log('user.name ?????', user)

  return (
    <div>
      <Notification />
      <h2>blogs</h2>

      {user === null
        ? (
          <Togglable buttonLabel={'login'}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
        )
        : (
          <>
            <p>{user.name} is logged in</p>
            <button onClick={handleLogout}>logout</button>
          </>
        )
      }
      <Routes>
        <Route path='/' element={<BlogList {...blogListProps} />} />
        <Route path='/users' element={<Users blogs={blogs} />} />
      </Routes>
    </div>
  )
}

export default App
