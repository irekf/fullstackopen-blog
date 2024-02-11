const express = require('express')
const cors = require('cors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')

const app = express()

logger.info('Connecting to MongoDB at', config.MONGODB_URI) // yeah, this can leak the password
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('Successfully connected to MongoDB')
    })
    .catch((error) => {
        logger.error('Error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)

module.exports = app