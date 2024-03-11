const mongoose = require('mongoose')
const { after, before, test, describe } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')

const api = supertest(app)
const Blog = require('../model/blog')
const { initialBlogs, blogsInDb, nonExistingId, badId } = require('./test_helper')

before(async () => {
    await Blog.deleteMany({})
    const blogs = initialBlogs.map(b => new Blog(b))
    const promises = blogs.map(b => b.save())
    await Promise.all(promises)
})

describe('getting blogs', () => {

    test('blogs are returned as JSON', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('an existing blog is returned by id', async () => {
        const currBlogs = await blogsInDb()
        const firstBlog = currBlogs[0]
        const getResult = await api.get(`/api/blogs/${firstBlog.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blog = getResult.body
        assert(blog.title === firstBlog.title && blog.author === firstBlog.author && blog.url === firstBlog.url
            && blog.likes === firstBlog.likes)
    })

    test('a non-existing blog results in 404', async () => {
        await api.get(`/api/blogs/${await nonExistingId()}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
    })

    test('a blog with bad ID results in 400', async () => {
        await api.get(`/api/blogs/${badId()}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('the identification field is id and not _id', async () => {
        const getResult = await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        getResult.body.forEach(b => {
            assert(b.id)
            assert.strictEqual(b._id, undefined)
        })
    })

})

describe('adding a new blog', () => {

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

})

describe('deleting blogs', () => {

    test('delete an existing blog', async () => {

        const blog = await new Blog({
            title: 'Test blog 4',
            author: 'Bob White',
            url: 'https://www.example.com',
        }).save()

        await api.delete(`/api/blogs/${blog._id.toString()}`)
            .expect(204)

    })

    test('delete a non-existing blog results in 404', async () => {
        await api.delete(`/api/blogs/${await nonExistingId()}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
    })

    test('delete a blog using a bad ID results in 400', async () => {
        await api.delete(`/api/blogs/${badId()}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

})

describe('updating blogs', () => {

    test('update an existing blog', async () => {

        const newBlog = {
            title: 'Test blog 5',
            author: 'Bob Forest',
            url: 'https://www.example.com',
            likes: 7
        }

        const newBlogObj = await new Blog(newBlog).save()

        const postResult = await api.put(`/api/blogs/${newBlogObj._id.toString()}`)
            .send({ likes: newBlog.likes + 2 })
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const blog = postResult.body

        assert(blog.title === newBlog.title && blog.author === newBlog.author && blog.url === newBlog.url
            && blog.likes === newBlog.likes + 2)

    })

    test('update a non-existing blog results in 404', async () => {
        await api.put(`/api/blogs/${await nonExistingId()}`)
            .send({ likes: 2 })
            .expect(404)
            .expect('Content-Type', /application\/json/)
    })

    test('update a blog with a bad ID results in 400', async () => {
        await api.put(`/api/blogs/${badId()}`)
            .send({ likes: 2 })
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

})

after(async () => {
    await mongoose.connection.close()
})
