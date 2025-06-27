const { test, describe } = require('node:test')
const assert = require('node:assert')
const _ = require('lodash')

const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listWithManyBlogs = [
  ...listWithOneBlog,
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 159,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Chad San',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'My life as a porn star',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 69,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Tori Black',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 10,
    __v: 0
  }
]

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list with many blogs return the total sum of likes', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 253)
  })

  test('when empty list return 0', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  test('returns the blog with the highest likes', () => {
    const expected = _.maxBy(listWithManyBlogs, 'likes')
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    assert.deepStrictEqual(result, expected) // Ignores references and only focuses on value equality
  })

  test('when the blog list is empty, returns empty object', () => {
    const result = listHelper.favoriteBlog([])
    assert.deepStrictEqual(result, {})
  })
})

describe('most blogs', () => {
  test('returns the author with the most blogs', () => {
    const result = listHelper.mostBlogs(listWithManyBlogs)
    const expected = {
      author: "Tori Black",
      blogs: 3
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns an empty object for an empty of array of blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {})
  })
})

