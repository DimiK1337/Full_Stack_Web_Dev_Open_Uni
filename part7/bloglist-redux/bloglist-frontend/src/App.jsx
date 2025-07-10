import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Routes, Route, useMatch
} from 'react-router-dom'

// Components
import NavigationBar from './components/NavigationBar'
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Users from './components/Users'
import User from './components/User'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

// Reducers
import { showAndHideNotification } from './reducers/notificationReducer'
import { initializeBlogs, createBlog, incrementLike, deleteBlog } from './reducers/blogReducer'
import { setUser, removeUser } from './reducers/userReducer'
import useUserMap from './hooks/useUserMap'

const App = () => {
  const dispatch = useDispatch()

  // State
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Refs
  const blogFormRef = useRef()

  // Matches for specific routes
  const users = useUserMap(blogs)
  const userMatch = useMatch('/users/:id')
  const foundUser = userMatch && users
    ? users.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const foundBlog = blogMatch && blogs.length > 0
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

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

  return (
    <div>
      <Notification />
      <NavigationBar/>
      <h2>blogs</h2>

      {user === null && (
        <Togglable buttonLabel={'login'}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      )}

      <Routes>
        <Route path='/' element={<BlogList
          blogs={blogs}
          loggedInUser={user}
          blogFormRef={blogFormRef}
          handleCreateBlog={handleCreateBlog} />}
        />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/users/:id' element={<User user={foundUser} />} />
        <Route
          path='/blogs/:id'
          element={
            foundBlog ? (
              <Blog
                blog={foundBlog}
                handleDelete={() => handleDelete(foundBlog)}
                handleLikeClick={() => handleLikeClick(foundBlog)}
              />
            ) : (
              <div>Loading blog...</div>
            )
          }
        />
      </Routes>
    </div>
  )
}

export default App
