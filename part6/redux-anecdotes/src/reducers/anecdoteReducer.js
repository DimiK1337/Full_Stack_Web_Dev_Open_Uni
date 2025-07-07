import { createSlice } from "@reduxjs/toolkit"

import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    updateVote(state, action) {
      const updated = action.payload
      return state.map(a => a.id !== updated.id ? a : updated)
    },

    appendAnecdote(state, action) {
      return [...state, action.payload]
    },

    setAnecdotes(state, action){
      return action.payload
    }
  }
})

export const { updateVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = anecdote => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(anecdote)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const incrementVote = anecdote => {
  return async dispatch => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const updatedAnecdote = await anecdoteService.updateAnecdote(updated.id, updated)
    dispatch(updateVote(updatedAnecdote)) 
  }
} 