const Blog = require('../models/blog')
const User = require('../models/user')

const listWithOneBlog = [
  {
    title: '0 Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }
]

const listWithManyBlogs = [
  ...listWithOneBlog,
  {
    title: '1 Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 159,
  },
  {
    title: '2 Go To Statement Considered Harmful',
    author: 'Chad San',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 0,
  },
  {
    title: '3 Go To Statement Considered Harmful',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
  },
  {
    title: 'My life as a porn star',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 69,
  },
  {
    title: '4 Go To Statement Considered Harmful',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const createNewBlog = async () => {
  const savedBlog = await Blog(listWithManyBlogs[4]).save()
  return savedBlog.toJSON()
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  listWithOneBlog,
  listWithManyBlogs,
  blogsInDB,
  createNewBlog,

  usersInDB
}