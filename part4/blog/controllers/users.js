const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs', { title: 1 }) // Only get the titles when displaying users

  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body

  const isDuplicateUser = await User.findOne({ username })

  if (isDuplicateUser) {
    return res.status(400).json({ error: 'username must be unique' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ name, username, passwordHash })
  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = userRouter