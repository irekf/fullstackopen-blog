const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../model/user')

usersRouter.post('/', async (request, response) => {

    const { username, name, password } = request.body

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const user = new User( { username, name, passwordHash })

    const userInDb = await user.save()

    response.status(201).json(userInDb)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
})

module.exports = usersRouter