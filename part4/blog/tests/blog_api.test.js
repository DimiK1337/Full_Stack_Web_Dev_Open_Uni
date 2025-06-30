const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there are some initial blogs saved', () => {

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

  // POST
  describe('when adding a blog to the db', () => {
    test('it will be added to the database', async () => {
      const newBlog = {
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

    test('a blog with the missing `likes` property will default to 0', async () => {
      const newBlog = {
        title: 'Is Java the tenth circle of hell? Screw over your colleague and suggest it for the frontend',
        author: 'Tori Black',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogs = await helper.blogsInDB()
      const mostRecentBlog = blogs[blogs.length - 1]

      assert(Object.hasOwn(mostRecentBlog, 'likes'))
      assert.strictEqual(mostRecentBlog.likes, 0)
    })

    test('a blog missing the `title` property will send a 400 BAD REQUEST', async () => {
      const newBlog = {
        author: 'Tori Black',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf'
      }

      const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(res.error.text.includes('Missing title from blog'))
    })

    test('a blog missing the `url` property will send a 400 BAD REQUEST', async () => {
      const newBlog = {
        title: 'Is Java the tenth circle of hell? Screw over your colleague and suggest it for the frontend',
        author: 'Tori Black'
      }

      const res = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(res.error.text.includes('Missing url from blog'))
    })
  })

  // DELETE
  describe('when deleting a blog from the db', () => {
    test('a status code of 204 is returned', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToDelete = blogsAtStart[0]

      // Delete the newBlog through it's id and compare the length
      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDB()
      assert(blogsAtEnd.length, helper.listWithManyBlogs.length - 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      assert(!titles.includes(blogToDelete.title))
    })
  })

  describe('when updating a blog from the db', () => {
    test('the number of likes is updated', async () => {
      const blogsAtStart = await helper.blogsInDB()
      const blogToUpdate = blogsAtStart[0]
      const updatedFields = {
        likes: 9999
      }

      const updatedBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedFields)
        .expect(200)

      assert(updatedBlog.body.likes, updatedFields.likes)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})
