import type { Note } from './types';

import { useState, useEffect } from 'react';

import {
  getAllNotes,
  createNote
} from './services/noteService';

const App = () => {

  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', content: 'testing'}
  ]);

  useEffect(() => {
    const fetchNotes = async () => {
      const res = await getAllNotes()
      setNotes(res)
    }
    fetchNotes()
  }, [])

  const noteCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const res = await createNote({ content: newNote });
    setNotes(notes.concat(res));
    setNewNote('');
  };

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={({ target }) => setNewNote(target.value)}
        />
        <button type="submit">add</button>
      </form>
      
      <ul>
        {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </div>
  );
}

export default App;