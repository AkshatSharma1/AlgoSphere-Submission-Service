async function apiPlugin(fastify, options) {
    fastify.register(require('./api/v1/v1Routes'),{prefix: '/v1'})
}

module.exports = apiPlugin