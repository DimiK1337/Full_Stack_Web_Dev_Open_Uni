
const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (accumulatedLikes, blogObj) => accumulatedLikes + blogObj.likes
  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  // Find the blog with the highest likes
  const likes = blogs.map(blog => blog.likes)
  const highestLikes = Math.max(...likes)
  return blogs.filter(blog => blog.likes === highestLikes)[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}