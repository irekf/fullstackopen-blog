const mongoose = require('mongoose')
const { after, before, test } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)
const Blog = require('../model/blogs')
const { initialBlogs } = require('./test_helper')

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

after(async () => {
    await mongoose.connection.close()
})