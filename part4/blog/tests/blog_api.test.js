const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  // Clear all the current blogs in the collection 'blogs'
  await Blog.deleteMany({})
  console.log('cleared blogs')

  const blogObjects = helper.listWithManyBlogs.map(blog => new Blog(blog)) // Create the blog objects
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
  console.log('done creating and saving blogs to test db')
})

test('blogs are returned as JSON', async () => {
  console.log('Entered test')

  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('the correct amount of blogs are returned', async () => {
  const res = await api.get('/api/blogs')
  const blogs = res.body.map(blog => blog.title)
  assert.strictEqual(blogs.length, helper.listWithManyBlogs.length)
})

test('returns blog with a predefined title', async () => {
  const res = await api.get('/api/blogs')
  const blogs = res.body.map(blog => blog.title)
  assert(blogs.includes('My life as a porn star'))
})


after(async () => {
  await mongoose.connection.close()
})



