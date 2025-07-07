
import { useDispatch, useSelector } from 'react-redux'

import { updateVote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(
    ({ anecdotes, filter }) => anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  )

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
              <button onClick={() => dispatch(updateVote(anecdote.id))}>vote</button>
            </div>
          </div>
        )
      }
    </>
  )
}

export default AnecdoteList