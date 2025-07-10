
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { Button, Navbar, Nav } from 'react-bootstrap'

import { removeUser } from '../reducers/userReducer'

import blogService from '../services/blogs'

const NavigationBar = () => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector(state => state.user)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch(removeUser())
  }

  const padding = {
    padding: 5
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as="span">
            <Link style={padding} to="/">blogs</Link>
          </Nav.Link>
          <Nav.Link as="span">
            <Link style={padding} to="/users">users</Link>
          </Nav.Link>
        </Nav>
        <Nav>
          {loggedInUser
            ? (
              <>
                <Navbar.Text style={{ color: 'white', marginRight: '10px' }}>
                  {loggedInUser.name} logged in
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  logout
                </Button>
              </>
            )
            : (
              <Nav.Link as="span">
                <Link style={padding} to="/login">login</Link>
              </Nav.Link>
            )
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )

}

export default NavigationBar