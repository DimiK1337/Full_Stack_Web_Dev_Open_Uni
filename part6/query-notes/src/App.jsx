import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { getNotes, createNote, updateNote } from "./requests"

const App = () => {
  const queryClient = useQueryClient()
  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {

      // Marks the entries in the cache as "stale" -> Fetches data from server async (makes a GET) -> Updates cache once resp is returned -> Triggers re-render of components
      //queryClient.invalidateQueries({ queryKey: ['notes'] })

      // Optimizes performance by updating the cache manually -> Rerenders components using `useQuery()`
      const notes = queryClient.getQueryData(['notes']) || []
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })
  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (newNote) => {
      //queryClient.invalidateQueries({ queryKey: ['notes'] })

      const notes = queryClient.getQueryData(['notes']) || []
      queryClient.setQueryData(['notes'], notes.map(note => note.id !== newNote.id ? note : newNote))
    }  
  })
  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({ ...note, important: !note.important})
  }

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const notes = result.data

  return(
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map(note =>
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content} 
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      )}
    </div>
  )
}

export default App