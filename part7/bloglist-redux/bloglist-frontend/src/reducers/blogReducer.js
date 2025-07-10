import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const initialState = []
const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    updateBlog(state, action) {
      const updated = action.payload
      return state.map(blog => blog.id !== updated.id ? blog : updated)
    },

    appendBlog(state, action) {
      return [...state, action.payload]
    },

    removeBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    },

    setBlogs(state, action) {
      return action.payload
    }
  }
})

export const { updateBlog, appendBlog, removeBlog, setBlogs } = blogSlice.actions
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

export const incrementLike = (blog) => {
  return async dispatch => {
    const updated = { ...blog, user: blog.user.id, likes: blog.likes + 1 }
    const updatedBlog = await blogService.updateBlog(updated.id, updated)
    dispatch(updateBlog(updatedBlog))
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addComment = (id, comment) => {
  return async dispatch => {
    const updatedBlog = await blogService.addComment(id, comment)
    dispatch(updateBlog(updatedBlog))
  }
}