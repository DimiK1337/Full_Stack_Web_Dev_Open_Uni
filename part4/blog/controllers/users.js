const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const User = require('../models/user')

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .populate('blogs')

  res.json(users)
})

userRouter.post('/', async (req, res) => {
  const { name, username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'username or password missing' })
  }

  const isDuplicateUser = await User.findOne({ username })

  if (isDuplicateUser) {
    return res.status(400).json({ error: 'expected username to be unique' })
  }

  if (username.length < 3 || password.length < 3) {
    return res.status(400).json({ error: 'username and password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ name, username, passwordHash })
  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = userRouter