const { createSubmission } = require("../../../controllers/submissionController");

// Define the schema for the submission payload
const submissionBodySchema = {
    type: 'object',
    required: ['userId', 'problemId', 'code', 'language'],
    properties: {
        userId: { type: 'string' },
        problemId: { type: 'string' },
        code: { type: 'string' },
        language: { type: 'string', enum: ['CPP', 'JAVA', 'PYTHON'] }
    },
};

async function submissionRoutes(fastify, options) {
    fastify.post('/', {
        schema: {
            body: submissionBodySchema
        }
    }, createSubmission);
}

module.exports = submissionRoutes;