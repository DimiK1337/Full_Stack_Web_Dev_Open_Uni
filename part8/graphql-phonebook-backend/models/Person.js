const mongoose = require('mongoose')

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 5,
    required: true
  },
  phone: {
    type: String,
    minLength: 5
  },
  street: {
    type: String,
    minLength: 5,
    required: true
  },
  city: {
    type: String,
    minLength: 3
  }
})

module.exports = mongoose.model('Person', personSchema)