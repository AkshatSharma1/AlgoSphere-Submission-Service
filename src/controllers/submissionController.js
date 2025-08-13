// src/controllers/submissionController.js (Slightly Improved)

const SubmissionService = require("../services/submissionService");
const SubmissionRepository = require("../repositories/submissionRepository");

const submissionService = new SubmissionService(new SubmissionRepository());

async function createSubmission(req, reply) {
  try {
    console.log("DEBUG: Controller received submission request.");

    const submissionData = {
      problemId: req.body.problemId,
      code: req.body.code,
      language: req.body.language,
      userId: req.user.id,
    };

    const response = await submissionService.addSubmission(submissionData);

    // Use 'reply' to send the response
    return reply.status(201).send({
      error: {},
      data: response,
      success: true,
      message: "Created submission successfully",
    });
  } catch (error) {
    console.error("DEBUG: An error was caught by the controller:", error);
    // Let the error bubble up to be handled by the global errorHandler
    throw error;
  }
}

// New controller method to handle fetching a submission
async function getSubmission(req, reply) {
    try {
        const submission = await submissionService.getSubmission(req.params.id);
        return reply.status(200).send({
            success: true,
            data: submission,
            error: {},
            message: "Successfully fetched submission"
        });
    } catch (error) {
        throw error;
    }
}

module.exports = {
  createSubmission,
  getSubmission
};
