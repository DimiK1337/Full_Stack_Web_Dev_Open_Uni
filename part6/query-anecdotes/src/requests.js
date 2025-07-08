import axios from 'axios'

const baseURL = 'http://localhost:3001/anecdotes'

const getAnecdotes = () => axios.get(baseURL).then(res => res.data)

const createAnecdote = (newAnecdote) => 
  axios.post(baseURL, newAnecdote).then(res => res.data)

const updateAnecdote = (updatedAnecdote) =>  
  axios.put(`${baseURL}/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data)

export {
  getAnecdotes,
  createAnecdote,
  updateAnecdote
}