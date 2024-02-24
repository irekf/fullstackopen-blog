const mongoose = require('mongoose')
const { after, test } = require('node:test')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)

test('blogs', async () => {
    await api.get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})