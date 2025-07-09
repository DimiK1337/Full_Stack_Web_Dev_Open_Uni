import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Components
import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

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
    setUser(loggedInUser)
    blogService.setToken(loggedInUser.token)
  }, [])

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

  const blogDisplay = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm createBlog={handleCreateBlog} />
        </Togglable>

        <br />
        {[...blogs]
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              handleLikeClick={() => handleLikeClick(blog)}
              handleDelete={() => handleDelete(blog)}
            />
          ))}
      </>
    )
  }

  return (
    <div>
      <Notification />
      {user === null ? (
        <Togglable buttonLabel={'login'}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        blogDisplay()
      )}
    </div>
  )
}

export default App
