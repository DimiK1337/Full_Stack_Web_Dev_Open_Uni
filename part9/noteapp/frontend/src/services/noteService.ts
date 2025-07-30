import type { Note, NewNote } from '../types';

import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/notes';

const getAllNotes = async () => {
  const res = await axios.get<Note[]>(BASE_URL);
  return res.data;
};

const createNote = async (object: NewNote) => {
  const res = await axios.post<Note>(BASE_URL, object);
  return res.data;
};

export {
  getAllNotes,
  createNote
}