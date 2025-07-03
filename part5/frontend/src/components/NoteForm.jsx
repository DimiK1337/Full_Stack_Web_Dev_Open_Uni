import { useState } from "react"

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()

    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div className="formDiv">
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          id='note-input'
          value={newNote}
          placeholder="write note content here"
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm