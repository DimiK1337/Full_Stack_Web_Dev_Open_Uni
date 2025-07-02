import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (blogObject) => {
  const config = {
    headers: {
      authorization: token
    }
  }
  const res = await axios.post(baseUrl, blogObject, config)
  return res.data
}

const updateBlog = async (id, blogObject) => {
  const res = await axios.put(`${baseUrl}/${id}`, blogObject)
  return res.data
}

const deleteBlog = async id => {
  const config = {
    headers: {
      authorization: token
    }
  }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default {
  getAll,
  createBlog,
  updateBlog,
  deleteBlog,
  setToken
}