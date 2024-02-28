const Blog = require('../model/blogs')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
    const blogs = await Blog.findById(request.params.id)
    if (blogs) {
        response.json(blogs)
    } else {
        response.status(404).json({ error: `Entry not found for ${request.params.id}` })
    }
})

blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const result = await blog.save()
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
    const id = request.params.id
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