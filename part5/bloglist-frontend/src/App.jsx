import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
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
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginFormProps = {
    username,
    password,
    setPassword,
    setUsername,
    handleLogin
  }

  const blogDisplay = () => {
    return (
      <>
      <h2>blogs</h2>
      <p>{user.name} is logged in</p>
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
    <Notification message={errorMessage} />
    {
      user === null
        ? <LoginForm {...loginFormProps} />
        : blogDisplay()
      }
  </div>
)
}

export default App