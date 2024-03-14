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

const extractToken = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

blogsRouter.post('/', async (request, response) => {

    const decodedToken = jwt.verify(extractToken(request), process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
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
    const result = await Blog.findByIdAndDelete(request.params.id)
    if (result) {
        response.status(204).end()
    } else {
        response.status(404).json({ error: `Entry not found for ${request.params.id}` })
    }
})

blogsRouter.put('/:id', async (request, response) => {

    const decodedToken = jwt.verify(extractToken(request), process.env.SECRET)
    if (!decodedToken || !decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }

    const id = request.params.id
    if (id !== decodedToken.id) {
        return response.status(401).json({ error: 'not owner' })
    }

    const likes = request.body.likes
    const result = await Blog.findByIdAndUpdate(id, { likes },
        { new: true, runValidators: true, context: 'query' })
    if (result) {
        response.json(result)
    } else {
        response.status(404).json({ error: `Entry not found for id ${id}` })
    }
})

module.exports = blogsRouter