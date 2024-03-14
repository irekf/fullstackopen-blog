const Blog = require('../model/blog')
const User = require('../model/user')
const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
        .populate('user', 'username name id').exec()
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blogs = await Blog.findById(request.params.id)
        .populate('user', 'username name id').exec()
    if (blogs) {
        response.json(blogs)
    } else {
        response.status(404).json({ error: `Entry not found for ${request.params.id}` })
    }
})

blogsRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const creator = await User.findById(decodedToken.id)
    const blog = new Blog({ ...request.body, user: creator })
    const result = await blog.save()
    if (creator) {
        creator.blogs.push(result.id)
        await creator.save()
    }
    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {

    const id = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const blog = await Blog.findById(id)
    if (!blog) {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(401).json({ error: 'not owner' })
    }

    const result = await blog.deleteOne()
    if (result) {
        response.status(204).end()
    } else {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }
})

blogsRouter.put('/:id', async (request, response) => {

    const id = request.params.id

    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const blog = await Blog.findById(id)
    if (!blog) {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
        return response.status(401).json({ error: 'not owner' })
    }

    const likes = request.body.likes
    const result = await blog.updateOne({ likes },
        { new: true, runValidators: true, context: 'query' })
    if (result) {
        response.json(result)
    } else {
        response.status(404).json({ error: `Entry not found for id ${id}` })
    }
})

module.exports = blogsRouter