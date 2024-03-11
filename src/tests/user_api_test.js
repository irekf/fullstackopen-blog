const mongoose = require('mongoose')
const { after, before, test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)
const User = require('../model/user')
const { initialUsers, usersInDb } = require('./test_helper')
const bcrypt = require('bcrypt')

before(async () => {
    await User.deleteMany({})
    const users = await Promise.all(initialUsers.map(async u => new User({
        username: u.username,
        name: u.name,
        passwordHash: await bcrypt.hash(u.password, 10)
    })))
    const promises = users.map(u => u.save())
    await Promise.all(promises)
})

describe('getting users', () => {

    test('users are returned as JSON', async () => {
        await api.get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

})

describe('adding a new user', () => {

    test('new user is created via POST', async () => {

        const newUser = {
            username: 'best@dmin',
            name: 'John Forest',
            password: '1234567890',
        }

        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const currUsers = await usersInDb()

        assert(currUsers.some(b => {
            return b.title === newUser.title &&
                b.author === newUser.author &&
                b.url === newUser.url &&
                b.likes === newUser.likes
        }))

    })

})

after(async () => {
    await mongoose.connection.close()
})