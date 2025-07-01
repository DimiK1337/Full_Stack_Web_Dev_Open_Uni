const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).send({ error: 'Missing title from blog' })
  }

  if (!body.url) {
    return response.status(400).send({ error: 'Missing url from blog' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'missing userId' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  // Get the token of the user who made the blog
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return response.status(400).json({ error: 'missing userId' })
  }

  // Check that the blog belongs to the user
  const foundBlog = await Blog.findById(id)
  if (!foundBlog || !foundBlog.user) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (foundBlog.user.toString() !== decodedToken.id) {
    return response.status(403).json({ error: 'unauthorized action' })
  }

  await Blog.findByIdAndDelete(id)

  // Update the referenced blog IDs in the user document to not include the deleted blog
  user.blogs = user.blogs.filter(blogID => blogID.toString() !== id)
  await user.save()
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const updateOptions = { new: true, runValidators: true, context: 'query' }

  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, updateOptions)

  if (!updatedBlog) {
    return response.status(404).send({ error: 'blog not found' })
  }

  response.json(updatedBlog)
})

module.exports = blogRouter