import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const initialState = []
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    // like action creator
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(blog => blog.id !== updated.id ? blog : updated)
    },

    appendBlog(state, action) {
      return [...state, action.payload]
    },

    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { updateBlog, appendBlog, setBlogs } = blogSlice.actions
export default blogSlice.reducer

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blog) => {
  return async dispatch => {
    const newBlog = await blogService.createBlog(blog)
    dispatch(appendBlog(newBlog))
  }
}