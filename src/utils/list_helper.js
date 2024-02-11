const { groupBy } = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    if (!(blogs instanceof Array)) {
        throw new TypeError('array required')
    }
    return blogs.reduce((prev, curr) => prev + curr.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!(blogs instanceof Array)) {
        throw new TypeError('array required')
    }
    return blogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr, {})
}

const mostBlogs = (blogs) => {
    if (!(blogs instanceof Array)) {
        throw new TypeError('array required')
    }
    const authorsGrouped = groupBy(blogs.filter((b) => b.author), 'author')
    const authorsGroupedList = Object.entries(authorsGrouped)
    if (authorsGroupedList.length === 0) {
        return {}
    }
    const mostBlogsEntry = authorsGroupedList
        .reduce((prev, curr) => prev[1].length > curr[1].length ? prev : curr, authorsGroupedList[0])
    return {
        author: mostBlogsEntry[0],
        blogs: mostBlogsEntry[1].length
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs
}