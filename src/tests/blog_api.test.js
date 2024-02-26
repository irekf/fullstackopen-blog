const mongoose = require('mongoose')
const { after, before, test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)
const Blog = require('../model/blogs')
const { initialBlogs, blogsInDb } = require('./test_helper')

before(async () => {
    await Blog.deleteMany({})
    const blogs = initialBlogs.map(b => new Blog(b))
    const promises = blogs.map(b => b.save())
    await Promise.all(promises)
})

test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('the identification field is id and not _id', async () => {
    const resultBlogs = await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    resultBlogs.body.forEach(b => {
        assert(b.id)
        assert.strictEqual(b._id, undefined)
    })
})

test('new blog is created via POST', async () => {

    const newBlog = {
        title: 'Test blog',
        author: 'Jon Doe',
        url: 'https://www.example.com',
        likes: 57,
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const currBlogs = await blogsInDb()

    assert(currBlogs.some(b => {
        return b.title === newBlog.title &&
            b.author === newBlog.author &&
            b.url === newBlog.url &&
            b.likes === newBlog.likes
    }))

})
test('new blog with no likes results in 0 likes', async () => {

    const newBlog = {
        title: 'Test blog 2',
        author: 'Joe Doe',
        url: 'https://www.example.com',
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const currBlogs = await blogsInDb()

    assert(currBlogs.some(b => {
        return b.title === newBlog.title &&
            b.author === newBlog.author &&
            b.url === newBlog.url &&
            b.likes === 0
    }))

})

test('new blog with no title results in 400', async () => {

    const newBlog = {
        author: 'Alice Doe',
        url: 'https://www.example.com',
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

})

test('new blog with no url results in 400', async () => {

    const newBlog = {
        title: 'Test blog 3',
        author: 'Bob Doe',
    }

    await api.post('/api/blogs')
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)

})

after(async () => {
    await mongoose.connection.close()
})