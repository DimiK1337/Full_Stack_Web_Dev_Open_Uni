
import { Link } from 'react-router-dom'

import blogService from '../services/blogs'
import UserContext, { useUserValue } from '../UserContext'
import { useContext } from 'react'

const NavigationBar = () => {
  const padding = {
    padding: 5
  }

  const navbarStyle = {
    backgroundColor: 'lightblue',
    padding: 5
  }

  const [loggedInUser, userDispatch] = useContext(UserContext)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    userDispatch({ type: 'REMOVE_USER' })
  }

  return (
    <div style={navbarStyle}>
      <Link style={padding} to='/'>blogs</Link>
      <Link style={padding} to='/users'>users</Link>
      {loggedInUser && (
        <>
          <span>{loggedInUser.name} is logged in</span>
          <button onClick={handleLogout}>logout</button>
        </>
      )}
    </div>
  )
}

export default NavigationBar