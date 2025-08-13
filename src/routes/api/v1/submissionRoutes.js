// src/routes/api/v1/submissionRoutes.js (Corrected)

const {
  createSubmission,
  getSubmission,
} = require("../../../controllers/submissionController");
const authenticate = require("../../../utils/authenticate");

// Define the schema for the submission payload
const submissionBodySchema = {
  type: "object",
  required: ["problemId", "code", "language"],
  properties: {
    // 2. REMOVED the 'userId' property. It will now come from the auth token.
    problemId: { type: "string" },
    code: { type: "string" },
    language: { type: "string", enum: ["CPP", "PYTHON", "JAVA"] },
  },
};

async function submissionRoutes(fastify, options) {
  fastify.post(
    "/",
    {
      schema: {
        body: submissionBodySchema,
      },
      preHandler: [authenticate],
    },
    createSubmission
  );

  // New GET route to fetch a submission by ID
  fastify.get(
    "/:id",
    {
      preHandler: [authenticate], // Also secure this endpoint
    },
    getSubmission
  );
}

module.exports = submissionRoutes;