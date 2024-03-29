const morgan = require('morgan')
const logger = require('./logger')
const jwt = require('jsonwebtoken')
morgan.token('post_body', (req) => {
    return JSON.stringify(req.body)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    }
    if (error.name === 'MongoServerError') {
        return response.status(400).send({ error: error.message })
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'JWT missing or invalid' })
    }
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'JWT expired' })
    }
    next(error)
}

const requestLogger = [
    morgan('tiny', { skip: (req) => req.method === 'POST' }),
    morgan(':method :url :status :res[content-length] - :response-time ms :post_body',
        { skip: (req) => req.method !== 'POST' })
]

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }
    next()
}

const userExtractor = (request, response, next) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'invalid token' })
    }
    request.user = decodedToken.id
    next()
}

module.exports = { requestLogger, unknownEndpoint, errorHandler, tokenExtractor, userExtractor }
