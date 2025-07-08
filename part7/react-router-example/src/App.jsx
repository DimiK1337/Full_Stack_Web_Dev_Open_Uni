import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>TKTL notes app</h2>
  </div>
)

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <ul>
      {notes.map(note =>
        <li key={note.id}>
          <Link to={`/notes/${note.id}`}>
            {note.content}
          </Link>
        </li>
      )}
    </ul>
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
          username: <input />
        </div>
        <div>
          password: <input type='password' />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
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

  const noteMatch = useMatch('/notes/:id')
  const note = noteMatch
    ? notes.find(note => note.id === Number(noteMatch.params.id))
    : null

  const login = (user) => {
    setUser(user)
  }

  return (
    <div>
      <div>
        <Link style={padding} to='/'>Home</Link>
        <Link style={padding} to='/notes'>Notes</Link>
        <Link style={padding} to='/users'>Users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to='/login'>login</Link>
        }
      </div>

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
