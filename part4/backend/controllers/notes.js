const notesRouter = require('express').Router()
const Note = require('../models/note')

// GET
notesRouter.get('/', (req, res, next) => {
  Note.find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => next(error))
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then(note => {
      if (!note) {
        return res.status(404).end()
      }

      res.json(note)
    })
    .catch(error => next(error))
})

// POST

notesRouter.post('/', (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).send({ error: 'content is missing' })
  }

  const newNote = new Note({
    content: body.content,
    important: body.important || false
  })

  newNote.save()
    .then(returnedNote => {
      res.json(returnedNote)
    })
    .catch(error => next(error))
})

// PUT
notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { content, important } = req.body

  const updateOptions = { new: true, runValidators: true, context: 'query' }
  Note.findByIdAndUpdate(id, { content, important }, updateOptions)
    .then(updatedPerson => {
      if (!updatedPerson) {
        return res.status(404).send({ error: 'person not found' })
      }
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

// DELETE
notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = notesRouter
