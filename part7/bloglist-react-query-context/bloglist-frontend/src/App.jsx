import { useState, useEffect, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import Togglable from './components/Togglable'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

// Contexts
import { useNotificationDispatch } from './NotificationContext'

const App = () => {

  // Query Client
  const queryClient = useQueryClient()

  // State
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const notificationDispatch = useNotificationDispatch()
  const [user, setUser] = useState(null)

  // Refs
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedInJSON) return
    const user = JSON.parse(loggedInJSON)
    blogService.setToken(user.token)

    // TODO: Use Context for logged in user
    setUser(user)
  }, [])

  // Blog Query & Mutation
  const blogQueryResult = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    onError: (error) => console.error('Error fetching blogs:', error)
  })

  const addBlogMutation = useMutation({
    mutationFn: async (blog) => await blogService.createBlog(blog),
    onSuccess: (newBlog) => {
      //queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })

  const blogs = blogQueryResult.data

  // Event handlers
  const setNotification = (message, type = 'success', time = 5) => {
    notificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: { message, type }
    })
    setTimeout(() => { notificationDispatch({ type: 'REMOVE_NOTIFICATION' }) }, time * 1000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      // TODO: useContext
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername(username)
      setPassword(password)

      // TODO: Use Context for logged in user
      setUser(user)

    } catch (exception) {
      setNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUsername('')
    setPassword('')

    // TODO: Use Context for logged in user
    setUser(null)
  }

  const createBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    setNotification(`Added a new blog titled '${blog.title}' by '${blog.author}'`)
    addBlogMutation.mutate({ ...blog, likes: 0 })
  }

  const handleLikeClick = async (blogToUpdate) => {
    const newBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id,
    }

    // TODO: Use React Query
    const updatedBlog = await blogService.updateBlog(blogToUpdate.id, newBlog)
    /* setBlogs(
      blogs.map((blog) => (blog.id !== updatedBlog.id ? blog : updatedBlog))
    ) */
  }

  // Handle delete
  const handleDelete = async (blogToDelete) => {
    const deleteOk = window.confirm(`delete blog ${blogToDelete.title}`)
    if (!deleteOk) return

    // TODO: Use React Query
    await blogService.deleteBlog(blogToDelete.id)
    //setBlogs(blogs.filter((blog) => blogToDelete.id !== blog.id))
  }

  const blogDisplay = () => {
    if (!blogs) {
      console.error('blogs array causes an error in blogDisplay(), blogs=', blogs)
    }
    return (
      <>
        <h2>blogs</h2>
        <p>{user.name} is logged in</p>
        <button onClick={handleLogout}>logout</button>
        <Togglable buttonLabel={'new blog'} ref={blogFormRef}>
          <BlogForm createBlog={createBlog} />
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

  // Shows 'loading' or 'error' for blogs
  if (blogQueryResult.isLoading) {
    return <div>Blogs are loading...</div>
  }

  if (blogQueryResult.isError) {
    console.error(blogQueryResult.error)
    return <div>Server error occurred while loading blogs</div>
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
