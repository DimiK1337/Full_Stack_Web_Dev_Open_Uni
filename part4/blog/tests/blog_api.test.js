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

test('all blog posts have a property `id`', async () => {
  const res = await api.get('/api/blogs')
  const blogs = res.body.map(blog => blog)
  blogs.forEach(blog => {
    assert.ok(blog.id)
  })
})

test('a valid blog can be added to the database', async () => {
  const newBlog =   {
    title: 'Is Java the tenth circle of hell? Screw over your colleague and suggest it for the frontend',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Get the blogs from the db and confirm the newly added blog is there
  const blogs = await helper.blogsInDB()
  assert(blogs.length, helper.listWithManyBlogs.length + 1)

  // Check if the title of the new blog is in the returned blogs
  const titles = blogs.map(blog => blog.title)
  assert(titles.includes(newBlog.title))
})


after(async () => {
  await mongoose.connection.close()
})



