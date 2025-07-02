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

  const addBlogToList = (newBlog) => {
    setBlogs(blogs.concat(newBlog))
    console.log('new blog', newBlog)
    blogFormRef.current.toggleVisibility()
    
    setErrorMessage({
      message: `Added a new blog titled '${newBlog.title}'`,
      type: 'success'
    })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    
  }

  const blogDisplay = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm addBlogToList={addBlogToList} />
        </Togglable>
        
        <br />
        {
          blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
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