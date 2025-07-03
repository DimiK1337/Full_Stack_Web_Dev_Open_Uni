const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')

const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

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

  describe('when making requests with JWT auth', () => {
    let token
    beforeEach(async () => {
      await User.deleteMany({})
      const userCredentials = { username: 'root', password: 'sekret' }
      const passwordHash = await bcrypt.hash(userCredentials.password, 10)
      const user = new User({ username: userCredentials.username, passwordHash, name: 'Dimitriy Kruglikov' })

      await user.save()

      // login in the user
      const loginRes = await api
        .post('/api/login')
        .send(userCredentials)

      token = loginRes.body.token
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
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
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/)

        assert(res.error.text.includes('Missing url from blog'))
      })

      test('a blog without the auth token will yield a 401', async () => {
        const newBlog = {
          title: 'Is Java the tenth circle of hell? Screw over your colleague and suggest it for the frontend',
          author: 'Tori Black',
          url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        }

        await api
          .post('/api/blogs')
          .set('Authorization', 'Bearer INVALID_TOKEN')
          .send(newBlog)
          .expect(401)
          .expect('Content-Type', /application\/json/)
      })
    })

    // DELETE
    describe('when deleting a blog from the db', () => {
      test('a status code of 204 is returned', async () => {
        const blogsAtStart = await helper.blogsInDB()

        const newBlog = { ...blogsAtStart[0], title: 'this will be deleted' }

        // Post the blog so the proper user can delete it
        const res = await api
          .post('/api/blogs')
          .set('Authorization', `Bearer ${token}`)
          .send(newBlog)
          .expect(201)

        const blogToDelete = res.body

        // Delete the newBlog through it's id and compare the length
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(204)

        const blogsAtEnd = await helper.blogsInDB()
        assert(blogsAtEnd.length, helper.listWithManyBlogs.length)

        const titles = blogsAtEnd.map(blog => blog.title)
        assert(!titles.includes(blogToDelete.title))
      })
    })
  })


  // PUT
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

describe('when there is initially one user in db', () => {
  let token
  beforeEach(async () => {
    await User.deleteMany({})
    const userCredentials = { username: 'root', password: 'sekret' }
    const passwordHash = await bcrypt.hash(userCredentials.password, 10)
    const user = new User({ username: userCredentials.username, passwordHash, name: 'Dimitriy Kruglikov' })

    await user.save()

    // login in the user
    const loginRes = await api
      .post('/api/login')
      .send(userCredentials)

    token = loginRes.body.token
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDB()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  // test the < 3 requirements
  describe('when credentials that are too short are supplied', () => {
    test('when the username is less than 3 chars', async () => {
      const usersAtStart = await helper.usersInDB()

      const response = await api
        .post('/api/users')
        .send({ password: 'az', username: 'idkbro' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('username and password must be at least 3 characters long'))

      const usersAtEnd = await helper.usersInDB()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test('when the password is less than 3 chars', async () => {
      const usersAtStart = await helper.usersInDB()

      const response = await api
        .post('/api/users')
        .send({ username: 'az', password: 'idkbro' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('username and password must be at least 3 characters long'))

      const usersAtEnd = await helper.usersInDB()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
  })

  describe('when missing info is forgotten', () => {
    // No username provided
    test('when the username is not provided', async () => {
      const usersAtStart = await helper.usersInDB()

      const response = await api
        .post('/api/users')
        .send({ password: 'Mashallah100' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      console.log('resp in no user prov', response.body)

      assert(response.body.error.includes('username or password missing'))

      const usersAtEnd = await helper.usersInDB()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    // No password
    test('when the password is not provided', async () => {
      const usersAtStart = await helper.usersInDB()

      const response = await api
        .post('/api/users')
        .send({ username: 'Allah9000' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('username or password missing'))

      const usersAtEnd = await helper.usersInDB()

      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

  })

  describe('when a blog is created', () => {
    test('the user property in the blog schema is populated', async () => {
      const newBlog = {
        title: 'Is Java the tenth circle of hell? Screw over your colleague and suggest it for the frontend',
        author: 'Tori Black',
        url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
        likes: 10
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const savedBlog = response.body

      // Get the blogs from the db and confirm the newly added blog is there
      const blogs = await helper.blogsInDB()
      assert(blogs.length, helper.listWithManyBlogs.length + 1)

      assert(Object.hasOwn(savedBlog, 'user'))

    })
  })
})


after(async () => {
  await mongoose.connection.close()
})
