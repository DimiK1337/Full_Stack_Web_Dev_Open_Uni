
import { useDispatch, useSelector } from 'react-redux'
import { showAndHideNotification } from '../reducers/notificationReducer'
import { incrementVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(
    ({ anecdotes, filter }) => anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  )

  const updateAnecdote = (anecdote) => {
    dispatch(incrementVote(anecdote))
    dispatch(showAndHideNotification(`You voted '${anecdote.content}'`))
  }

  return (
    <>
      {
        [...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => updateAnecdote(anecdote)}>vote</button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default AnecdoteList