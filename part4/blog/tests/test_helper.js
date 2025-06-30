const Blog = require('../models/blog')

const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }
]

const listWithManyBlogs = [
  ...listWithOneBlog,
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 159,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Chad San',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 0,
  },
  {
    title: 'Go To Statement Considered Harmful',
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
    title: 'Go To Statement Considered Harmful',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
  }
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  listWithOneBlog,
  listWithManyBlogs,
  blogsInDB
}