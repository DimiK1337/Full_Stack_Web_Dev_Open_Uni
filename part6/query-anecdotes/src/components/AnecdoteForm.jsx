import { useContext } from 'react'
import NotificationContext from '../NotificationContext'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import { useSetAndRemoveNotification } from '../NotificationContext'

// Server/API
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
  const setNotification = useSetAndRemoveNotification()

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      //queryClient.invalidateQueries({ queryKey: ['anecdotes'] }) // Simple, but less performance optimized
      
      // Performance optimized -> One less GET 
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      setNotification(`Added anecdote ${newAnecdote.content}`)
    },
    onError: (error) => {
      setNotification(error.response.data.error)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate({ content: content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
