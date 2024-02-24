const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const blogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }
]

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

describe('total likes', () => {

    test('when list is undefined, expects TypeError', () => {
        assert.throws(() => listHelper.totalLikes(undefined), TypeError)
    })

    test('when list is empty, equals 0', () => {
        const result = listHelper.totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list is not an array, expects TypeError', () => {
        assert.throws(() => listHelper.totalLikes(8), TypeError)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        assert.strictEqual(result, 5)
    })

    test('when list has multiple blogs, equals the likes of all the blogs', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
    })

})

describe('favourite blog', () => {

    test('when list is undefined, expects TypeError', () => {
        assert.throws(() => listHelper.favoriteBlog(undefined), TypeError)
    })

    test('when list is empty, equals {}', () => {
        const result = listHelper.favoriteBlog([])
        assert.deepStrictEqual(result, {})
    })

    test('when list is not an array, expects TypeError', () => {
        assert.throws(() => listHelper.favoriteBlog(8), TypeError)
    })

    test('when list has a single blog, equals to that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, listWithOneBlog[0])
    })

    test('when list has multiple blogs, equals to the one with the most likes', () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {
            _id: '5a422b3a1b54a676234d17f9',
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            __v: 0
        })
    })

})

describe('most blogs', () => {

    test('when list is undefined, expects TypeError', () => {
        assert.throws(() => listHelper.mostBlogs(undefined), TypeError)
    })

    test('when list is empty, equals {}', () => {
        const result = listHelper.mostBlogs([])
        assert.deepStrictEqual(result, {})
    })

    test('when list has no authors, equals {}', () => {
        const result = listHelper.mostBlogs([{ likes: 9 }, { likes: 1 }])
        assert.deepStrictEqual(result, {})
    })

    test('when list is not an array, expects TypeError', () => {
        assert.throws(() => listHelper.mostBlogs(8), TypeError)
    })

    test('when list has a single blog, equals to that blog', () => {
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: listWithOneBlog[0].author,
            blogs: 1
        })
    })

    test('when list has multiple blogs, equals to the author with the most blogs', () => {
        const result = listHelper.mostBlogs(blogs)
        assert.deepStrictEqual(result, {
            author: 'Robert C. Martin',
            blogs: 3
        })
    })

})

describe('most likes', () => {

    test('when list is undefined, expects TypeError', () => {
        assert.throws(() => listHelper.mostLikes(undefined), TypeError)
    })

    test('when list is empty, equals {}', () => {
        const result = listHelper.mostLikes([])
        assert.deepStrictEqual(result, {})
    })

    test('when list has no authors, equals {}', () => {
        const result = listHelper.mostLikes([{ likes: 9 }, { likes: 1 }])
        assert.deepStrictEqual(result, {})
    })

    test('when list has no likes, equals the first entry', () => {
        const result = listHelper.mostLikes([{ author: 'Bob' }, { author: 'Alice' }])
        assert.deepStrictEqual(result, {
            author: 'Bob',
            likes: 0
        })
    })

    test('when list is not an array, expects TypeError', () => {
        assert.throws(() => listHelper.mostLikes(8), TypeError)
    })

    test('when list has a single blog, equals to that blog', () => {
        const result = listHelper.mostLikes(listWithOneBlog)
        assert.deepStrictEqual(result, {
            author: listWithOneBlog[0].author,
            likes: listWithOneBlog[0].likes
        })
    })

    test('when list has multiple blogs, equals to the author with the most likes', () => {
        const result = listHelper.mostLikes(blogs)
        assert.deepStrictEqual(result, {
            author: 'Edsger W. Dijkstra',
            likes: 17
        })
    })

})