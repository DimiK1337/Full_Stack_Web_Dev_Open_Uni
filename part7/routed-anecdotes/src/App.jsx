import { useState } from 'react'
import {
  Routes, Route, Link,
  useMatch,
  useNavigate
} from 'react-router-dom'

import { useField } from './hooks'

const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/' style={padding}>anecdotes</Link>
      <Link to='/create-new' style={padding}>create new</Link>
      <Link to='about' style={padding}>about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes, notification }) => (
  <div>
    <p>{notification}</p>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content}</h2>
    <p>has {anecdote.votes} votes</p>
    <div>
      for more info see: <a href={anecdote.info}>{anecdote.info}</a>
    </div>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const navigate = useNavigate()

  // States
  const { reset: resetContent, ...contentInputProps } = useField('text')
  const { reset: resetAuthor, ...authorInputProps } = useField('text')
  const { reset: resetInfo, ...infoInputProps } = useField('text')

  const handleSubmit = (e) => {
    e.preventDefault()
    const newNote = {
      content: contentInputProps.value,
      author: authorInputProps.value,
      info: infoInputProps.value,
      votes: 0
    }
    console.log('new note in handle submit', newNote);
    
    props.addNew(newNote)

    // Set the notification -> clear form fields -> redirect
    props.setNotification(`A new anecdote '${contentInputProps.value}' has been created!`)
    navigate('/')
  }

  const handleReset = (e) => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' {...contentInputProps}/>
        </div>
        <div>
          author
          <input name='author' {...authorInputProps}/>
        </div>
        <div>
          url for more info
          <input name='info' {...infoInputProps}/>
        </div>
        <button>create</button>
        <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const anecdoteMatch = useMatch('/anecdotes/:id')
  const anecdote = anecdoteMatch 
    ? anecdotes.find(a => a.id === Number(anecdoteMatch.params.id))
    : null

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {  
    setAnecdotes(anecdotes.concat({ ...anecdote, id: Math.round(Math.random() * 10000) }))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const setAndHideNotification = (message) => {
    setNotification(message)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Routes>
        <Route path='/' element={<AnecdoteList anecdotes={anecdotes} notification={notification}/>}/>
        <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote}/>}/>
        <Route path='/create-new' element={<CreateNew addNew={addNew} setNotification={setAndHideNotification}/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
