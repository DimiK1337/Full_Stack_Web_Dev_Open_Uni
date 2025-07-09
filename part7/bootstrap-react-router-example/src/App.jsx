import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from 'react-router-dom'

import {
  Table, Form, Button, Alert, Navbar, Nav
} from 'react-bootstrap'

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
  </div>
)

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <Table striped>
      <tbody>
        {notes.map(note =>
          <tr key={note.id}>
            <td>
              <Link to={`/notes/${note.id}`}>
                {note.content}
              </Link>
            </td>
            <td>{note.user}</td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
)

const Note = ({ note }) => {
  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

const Users = () => (
  <div>
    <h2>Users</h2>
  </div>
)

const Login = (props) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    props.onLogin('GOD')
    navigate('/')
  }

  return (
    <div>
      <h2>Login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            name='username'
            type='text'
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password: </Form.Label>
          <Form.Control
            name='password'
            type='password'
          />
        </Form.Group>
        <Button variant='primary' type="submit">login</Button>
      </Form>
    </div>
  )
}

const NavBarMenu = ({ padding, user }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">home</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/notes">notes</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user
              ? <em style={padding}>{user} logged in</em>
              : <Link style={padding} to="/login">login</Link>
            }
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

const App = () => {

  const padding = {
    padding: 5
  }

  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'HTML is easy',
      important: true,
      user: 'Matti Luukkainen'
    },
    {
      id: 2,
      content: 'Browser can execute only JavaScript',
      important: false,
      user: 'Matti Luukkainen'
    },
    {
      id: 3,
      content: 'Most important methods of HTTP-protocol are GET and POST',
      important: true,
      user: 'Arto Hellas'
    }
  ])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const noteMatch = useMatch('/notes/:id')
  const note = noteMatch
    ? notes.find(note => note.id === Number(noteMatch.params.id))
    : null

  const login = (user) => {
    setUser(user)
    setMessage(`Welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  return (
    <div className='container'>
      {(message &&
        <Alert variant='success'>
          {message}
        </Alert>
      )}

      <NavBarMenu user={user} padding={padding} />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/notes' element={<Notes notes={notes} />} />
        <Route path='/notes/:id' element={<Note note={note} />} />
        <Route path='/users' element={user ? <Users /> : <Navigate replace to='/login' />} />
        <Route path='/login' element={<Login onLogin={login} />} />
      </Routes>
      <footer>
        <br />
        <em>Note app, Department of Computer Science 2024</em>
      </footer>
    </div>
  )
}

export default App
