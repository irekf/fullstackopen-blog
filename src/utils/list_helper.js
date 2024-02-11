
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

module.exports = {
    dummy, totalLikes
}