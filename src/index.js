const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

logger.info('connecting to MongoDB at', config.MONGODB_URI)
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('successfully connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})