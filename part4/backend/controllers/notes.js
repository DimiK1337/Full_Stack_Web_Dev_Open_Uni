const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()

const Note = require('../models/note')
const User = require('../models/user')


const getTokenFrom = req => {
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.replace('Bearer ', '')
  }
  return null
}

// GET
notesRouter.get('/', async (req, res) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(notes)
})

notesRouter.get('/:id', async (req, res) => {
  const id = req.params.id
  const note = await Note.findById(id)

  if (!note) {
    return res.status(404).end()
  }
  res.json(note)
})

// POST

notesRouter.post('/', async (req, res) => {
  const body = req.body

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)
  if (!decodedToken.id) {
    return res.status(401).json({ error: 'invalid token' })
  }

  const user = await User.findById(decodedToken.id)

  if (!user) {
    return res.status(400).send({ error: 'userId missing or invalid' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  res.status(201).json(savedNote)
})

// PUT
notesRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const { content, important } = req.body

  const updateOptions = { new: true, runValidators: true, context: 'query' }
  const updatedNote = await Note.findByIdAndUpdate(id, { content, important }, updateOptions)

  if (!updatedNote) {
    return res.status(404).send({ error: 'note not found' })
  }
  res.json(updatedNote)
})

// DELETE
notesRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  await Note.findByIdAndDelete(id)
  res.status(204).end()
})

module.exports = notesRouter
