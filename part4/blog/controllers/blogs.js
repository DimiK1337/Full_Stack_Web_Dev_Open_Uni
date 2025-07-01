const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()

const middleware = require('../utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body

  if (!body.title) {
    return response.status(400).send({ error: 'Missing title from blog' })
  }

  if (!body.url) {
    return response.status(400).send({ error: 'Missing url from blog' })
  }

  const user = request.user

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

blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const { id } = request.params

  const user = request.user

  // Check that the blog belongs to the user
  const foundBlog = await Blog.findById(id)
  if (!foundBlog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!foundBlog.user || foundBlog.user.toString() !== user._id.toString()) {
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