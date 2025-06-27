
const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (accumulatedLikes, blogObj) => accumulatedLikes + blogObj.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  // Find the blog with the highest likes
  if (!blogs || blogs.length === 0) return {}
  const likes = blogs.map(blog => blog.likes)
  const highestLikes = Math.max(...likes)
  return blogs.filter(blog => blog.likes === highestLikes)[0]
}

const mostBlogs = blogs => {
  // Find the author with the most blogs
  if (!blogs || blogs.length === 0) return {}

  const reducer = (accumulatedAuthorCounts, blog) => ({
    ...accumulatedAuthorCounts,

    // The syntax [..] defines a key in an object, needed since a key is being made from another key
    [blog.author]: (accumulatedAuthorCounts[blog.author] || 0) + 1 
  })
  const authorCounts = blogs.reduce(reducer, {})

  const highestBlogCount = Math.max(...Object.values(authorCounts))
  for (const [author, count] of Object.entries(authorCounts)){
    if (count === highestBlogCount) {
      return {
        author: author,
        blogs: count
      }
    }
  }
  return {}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}