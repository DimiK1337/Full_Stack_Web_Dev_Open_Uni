require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = process.env.MONGODB_URI
mongoose.connect(mongoUrl)
  .then(result => {
    console.log(`connected to mongo at URL:${mongoUrl}`)
  })
  .catch(error => {
    console.error("mongo db conn error", error)
  })

app.use(express.json())

app.get('/', (request, response) => {
  response.send(`<h1>HELLO WORLD</h1>`)
})

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`URL: http://localhost:${PORT}/`)
  console.log(`API ENDPOINT: http://localhost:${PORT}/api/blogs`)
})