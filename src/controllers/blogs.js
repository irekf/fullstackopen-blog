const Blog = require('../model/blog')
const User = require('../model/user')
const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')

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

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

    const creator = await User.findById(request.user)
    if (!creator) {
        response.status(404).json({ error: 'User not found for this blog entry' })
    }
    const blog = new Blog({ ...request.body, user: creator })
    const result = await blog.save()
    if (creator) {
        creator.blogs.push(result.id)
        await creator.save()
    }
    response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

    const id = request.params.id

    const blog = await Blog.findById(id)
    if (!blog) {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }

    if (blog.user.toString() !== request.user.toString()) {
        return response.status(401).json({ error: 'not owner' })
    }

    const result = await blog.deleteOne()
    if (result) {
        response.status(204).end()
    } else {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {

    const id = request.params.id

    const blog = await Blog.findById(id)
    if (!blog) {
        response.status(404).json({ error: `Entry not found for ${id}` })
    }

    if (blog.user.toString() !== request.user.toString()) {
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