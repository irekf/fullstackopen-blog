const morgan = require('morgan')
morgan.token('post_body', (req) => {
    return JSON.stringify(req.body)
})

module.exports.requestLogger = [
    morgan('tiny', { skip: (req) => req.method === 'POST' }),
    morgan(':method :url :status :res[content-length] - :response-time ms :post_body',
        { skip: (req) => req.method !== 'POST' })
]