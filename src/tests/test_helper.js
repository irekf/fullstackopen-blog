
const Blog = require('../model/blog')
const User = require('../model/user')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
    },
    {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
    },
    {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
    },
    {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
    },
    {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'Dummy title',
        author: 'Noname Noname',
        url: 'http://example.com'
    })
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const badId = () => {
    return 'foobar'
}

const initialUsers = [
    {
        username: 'mart1n',
        name: 'Martin Wolf',
        password: '7H&12jLph712m',
    },
    {
        username: 'j99beep',
        name: 'Anna L',
        password: 'jsnfjnJ9S1#',
    },
    {
        username: 'grim-moon',
        name: 'Harold de Vries',
        password: 'k8jDm9)1DL4',
    },
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = { initialBlogs, blogsInDb, nonExistingId, badId, initialUsers, usersInDb }