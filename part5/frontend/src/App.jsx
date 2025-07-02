import { useState, useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Note from './components/Note'
import NoteForm from './components/NoteForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Footer from './components/Footer'

import noteService from './services/notes'
import loginService from './services/login'

const App = () => {

  // State
  const [notes, setNotes] = useState([])
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  // Refs
  const noteFormRef = useRef() // Used for closing the "create new form" form

  const getInitialNotesHook = () => {
    noteService
      .getAll()
      .then((initialNotes) => setNotes(initialNotes))
  }
  useEffect(getInitialNotesHook, [])

  const getTokenFromLocalStorageHook = () => {
    const loggedinJSON = window.localStorage.getItem('loggedNoteappUser')
    if (!loggedinJSON) return
    const user = JSON.parse(loggedinJSON)
    setUser(user)
    noteService.setToken(user.token)
  }
  useEffect(getTokenFromLocalStorageHook, [])

  console.log('render', notes.length, 'notes')

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })

    noteFormRef.current.toggleVisibility()
  }

  const notesToShow = showAll ? notes : notes.filter((note) => note.important)

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(
        returnedNote => setNotes(
          notes.map(note => note.id === id ? returnedNote : note)
        )
      )
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)

        setNotes(notes.filter(note => note.id !== id))
      })
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      noteService.setToken(user.token)
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

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteappUser')
    noteService.setToken('')
    setUser(null)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {
        user === null
          ? <Togglable buttonLabel={'login'}>
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleSubmit={handleLogin}
            />
          </Togglable>
          :
          <div>
            <p>{user.username} is logged in</p>
            <button onClick={handleLogout}>
              logout
            </button>
            <Togglable buttonLabel={'new note'} ref={noteFormRef}>
              <NoteForm createNote={addNote}/>
            </Togglable>
          </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <Footer />
    </div>
  )
}

export default App


