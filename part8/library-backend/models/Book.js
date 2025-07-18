const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 5
  },
  published: {
    type: Number
  },
  genres: [
    {
      type: String
    }
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})

bookSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Book', bookSchema)