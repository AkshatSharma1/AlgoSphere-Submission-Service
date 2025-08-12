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

module.exports = {
  createSubmission,
};
