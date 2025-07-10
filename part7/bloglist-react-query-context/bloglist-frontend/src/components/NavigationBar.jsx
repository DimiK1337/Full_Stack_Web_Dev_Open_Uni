
import { Link } from 'react-router-dom'
import { Navbar, Nav, Button } from 'react-bootstrap'

import blogService from '../services/blogs'
import UserContext from '../UserContext'
import { useContext } from 'react'

const NavigationBar = () => {
  const padding = {
    padding: 5
  }

  const [loggedInUser, userDispatch] = useContext(UserContext)

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    userDispatch({ type: 'REMOVE_USER' })
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