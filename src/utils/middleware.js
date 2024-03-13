const morgan = require('morgan')
const logger = require('./logger')
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
    next(error)
}

const requestLogger = [
    morgan('tiny', { skip: (req) => req.method === 'POST' }),
    morgan(':method :url :status :res[content-length] - :response-time ms :post_body',
        { skip: (req) => req.method !== 'POST' })
]

module.exports = { requestLogger, unknownEndpoint, errorHandler }
