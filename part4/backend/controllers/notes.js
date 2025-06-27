const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
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

  if (!body.content) {
    return res.status(400).send({ error: 'content is missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  const savedNote = await note.save()
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
