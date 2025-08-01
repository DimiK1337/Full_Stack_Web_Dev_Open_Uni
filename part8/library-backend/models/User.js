const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  favoriteGenre: {
    type: String,
    required: true,
    minLength: 3
  }
})

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema)