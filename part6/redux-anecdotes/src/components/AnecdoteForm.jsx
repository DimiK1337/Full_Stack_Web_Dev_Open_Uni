
import { useDispatch } from 'react-redux'

import { createAnecdote } from '../reducers/anecdoteReducer'
import { showAndHideNotification } from '../reducers/notificationReducer'

import anecdoteService from '../services/anecdotes'

const AnecdoteForm = () => {

  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const anecdote = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNote(anecdote)
    dispatch(createAnecdote(newAnecdote))
    dispatch(showAndHideNotification(`Created anecdote ${anecdote}`))
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name='anecdote' /></div>
        <button type='submit'>create</button>
      </form>
    </>
  )
}

export default AnecdoteForm