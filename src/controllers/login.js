
const loginRouter = require('express').Router()
const User = require('../model/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response) => {

    const { username, password } = request.body

    const user = await User.findOne({ username })
    logger.info(user)
    const authenticated = user && await bcrypt.compare(password, user.passwordHash)

    if (!authenticated) {
        return response.status(401).json({ error: 'username or password incorrect' })
    }

    const tokenData = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(tokenData, process.env.SECRET, { expiresIn: 3600 })

    return response.status(200).json({ token, username: user.username, name: user.name })
})

module.exports = loginRouter