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
  Container,
  TableContainer, Table, TableBody, TableRow, TableCell, Paper,
  TextField, Button,
  AppBar, Toolbar, IconButton,
  Alert
} from '@mui/material'

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
  </div>
)

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <TableContainer component={Paper} className='table striped'>
      <Table>
        <TableBody>
          {notes.map(note =>
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>
                  {note.content}
                </Link>
              </TableCell>
              <TableCell>{note.user}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
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
      <form onSubmit={onSubmit}>
        <div>
          <TextField label='username' />
        </div>
        <div>
          <TextField label='password' />
        </div>
        <Button variant='contained' color='primary' type="submit">
          login
        </Button>
      </form>
    </div>
  )
}

const NavBarMenu = ({ padding, user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
        </IconButton>
        <Button color="inherit">
          <Link to="/">home</Link>
        </Button>
        <Button color="inherit">
          <Link to="/notes">notes</Link>
        </Button>
        <Button color="inherit">
          <Link to="/users">users</Link>
        </Button>
        <Button color="inherit">
          {user
            ? <em>{user} logged in</em>
            : <Link to="/login">login</Link>
          }
        </Button>
      </Toolbar>
    </AppBar>
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
        <Alert security='success'>
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
