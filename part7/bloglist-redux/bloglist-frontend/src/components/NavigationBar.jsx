
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { removeUser } from '../reducers/userReducer'

import blogService from '../services/blogs'

const NavigationBar = () => {
  const padding = {
    padding: 5
  }

  const navbarStyle = {
    backgroundColor: 'lightblue',
    padding: 5
  }

  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.user)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch(removeUser())
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