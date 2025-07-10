import { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  Routes, Route, Link,
  useMatch
} from 'react-router-dom'

// Components
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import BlogView from './components/BlogView'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'

import Users from './components/Users'
import User from './components/User'

// Services
import blogService from './services/blogs'
import loginService from './services/login'

// Contexts
import { useNotificationDispatch } from './NotificationContext'
import UserContext from './UserContext'
import useUserMap from './hooks/useUserMap'
import NavigationBar from './components/NavigationBar'


const App = () => {
  // Query Client
  const queryClient = useQueryClient()

  // React internal State
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // Context state
  const notificationDispatch = useNotificationDispatch()
  const [user, userDispatch] = useContext(UserContext)

  // Refs
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedInJSON = window.localStorage.getItem('loggedBlogappUser')
    if (!loggedInJSON) return
    const loggedInUser = JSON.parse(loggedInJSON)
    blogService.setToken(loggedInUser.token)
    userDispatch({ type: 'SET_USER', payload: loggedInUser })
  }, [userDispatch])

  // Blog Query & Mutation
  const blogQueryResult = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => await blogService.getAll(),
    onError: (error) => console.error('Error fetching blogs:', error)
  })

  const addBlogMutation = useMutation({
    mutationFn: async (newBlog) => await blogService.createBlog(newBlog),
    onSuccess: (newBlog) => {
      //queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    }
  })

  const updateBlogMutation = useMutation({
    mutationFn: async (updatedBlog) => await blogService.updateBlog(updatedBlog.id, updatedBlog),
    onSuccess: (updatedBlog) => {
      //queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    }
  })

  const deleteBlogMutation = useMutation({
    mutationFn: async (id) => {
      await blogService.deleteBlog(id)
      return id // Return the id, so it can be passed to onSuccess
    },
    onSuccess: (id) => {
      //queryClient.invalidateQueries({ queryKey: ['blogs'] })
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.filter(blog => blog.id !== id))
    }
  })

  const blogs = blogQueryResult.data

  // Matches for specific routes
  const users = useUserMap(blogs)

  const userMatch = useMatch('/users/:id')
  const foundUser = userMatch && users
    ? users.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useMatch('/blogs/:id')
  const foundBlog = blogMatch && blogs
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

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
      const loggedInUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedInUser))
      blogService.setToken(loggedInUser.token)
      setUsername(username)
      setPassword(password)
      userDispatch({ type: 'SET_USER', payload: loggedInUser })

    } catch (exception) {
      setNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUsername('')
    setPassword('')
    userDispatch({ type: 'REMOVE_USER' })
  }

  const handleCreateBlog = async (blog) => {
    blogFormRef.current.toggleVisibility()
    setNotification(`Added a new blog titled '${blog.title}' by '${blog.author}'`)
    addBlogMutation.mutate({ ...blog, likes: 0 })
  }

  const handleLikeClick = async (blogToUpdate) => updateBlogMutation.mutate({
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
    user: blogToUpdate.user.id
  })

  const handleDelete = async (blogToDelete) => {
    const deleteOk = window.confirm(`delete blog ${blogToDelete.title}`)
    if (!deleteOk) return
    deleteBlogMutation.mutate(blogToDelete.id)
  }

  // Shows 'loading' or 'error' for blogs
  if (blogQueryResult.isLoading) {
    return <div>Blogs are loading...</div>
  }

  if (blogQueryResult.isError) {
    console.error(blogQueryResult.error)
    return <div>Server error occurred while loading blogs</div>
  }

  // Custom Routes
  return (
    <div className='container'>
      <Notification />
      <NavigationBar/>
      <h2>blogs</h2>

      {user === null &&
        <Togglable buttonLabel={'login'}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      }
      <Routes>
        <Route path='/' element={<BlogList
          blogs={blogs}
          blogFormRef={blogFormRef}
          handleCreateBlog={handleCreateBlog} />}
        />
        <Route path='/users' element={<Users users={users} />} />
        <Route path='/users/:id' element={<User user={foundUser} />} />
        <Route path='/blogs/:id' element={<Blog
          user={user}
          blog={foundBlog}
          handleDelete={() => handleDelete(foundBlog)}
          handleLikeClick={() => handleLikeClick(foundBlog)} />}
        />
      </Routes>
    </div >
  )
}

export default App
