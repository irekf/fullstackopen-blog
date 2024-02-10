const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const Blog = require('./model/blogs')

const password = process.argv[2]

const mongoUrl = process.env.MONGO_URI || `mongodb://fullstackopen:${password}@localhost:27017/bloglist`
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)

    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

const PORT = 3003
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
})