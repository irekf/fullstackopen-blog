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
    return blogs.reduce((prev, curr) => prev.likes >= curr.likes ? prev : curr, {})
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
        .reduce((prev, curr) => prev[1].length >= curr[1].length ? prev : curr, authorsGroupedList[0])
    return {
        author: mostBlogsEntry[0],
        blogs: mostBlogsEntry[1].length
    }
}

const mostLikes = (blogs) => {
    if (!(blogs instanceof Array)) {
        throw new TypeError('array required')
    }
    const authorsGrouped = groupBy(blogs.filter((b) => b.author), 'author')
    const authorsGroupedList = Object.entries(authorsGrouped)
    if (authorsGroupedList.length === 0) {
        return {}
    }
    const authorsLikes = authorsGroupedList.map((entry) => {
        return {
            author: entry[0],
            likes: entry[1].reduce((prev, curr) => prev + (curr.likes ? curr.likes : 0), 0)
        }
    })
    return authorsLikes.reduce((prev, curr) => prev.likes >= curr.likes ? prev : curr, authorsLikes[0])
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}