// src/services/submissionService.js

const { fetchProblemDetails } = require("../apis/problemAdminApi");
const SubmissionCreationError = require("../errors/SubmissionCreationError");
const SubmissionProducer = require("../producers/submissionQueueProducer");

class SubmissionService {
  constructor(submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async addSubmission(submissionPayload) {
    try {
      const problemId = submissionPayload.problemId;
      const problemAdminApiResponse = await fetchProblemDetails(problemId);

      if (!problemAdminApiResponse || !problemAdminApiResponse.data) {
        throw new SubmissionCreationError(
          "Failed to get valid problem details."
        );
      }

      const problemDetails = problemAdminApiResponse.data;
      const languageCodeStub = problemDetails.codeStubs.find(
        (stub) =>
          stub.language.toLowerCase() ===
          submissionPayload.language.toLowerCase()
      );

      if (!languageCodeStub) {
        throw new SubmissionCreationError(
          `No code stub found for language: ${submissionPayload.language}`
        );
      }

      let userCode = submissionPayload.code;

      // ******************** START: Indentation Fix ********************
      // If the language is Python, automatically indent the user's code
      // to fit inside the class method structure.
      if (submissionPayload.language.toLowerCase() === "python") {
        const baseIndent = "    "; // 4 spaces for one level
        userCode = userCode
          .split("\n")
          .map((line) => baseIndent + line)
          .join("\n");
      }
      // ********************* END: Indentation Fix *********************

      // Combine snippets with the (now indented) user code
      submissionPayload.code =
        languageCodeStub.startSnippet +
        "\n" + // Use a single newline for cleaner code
        userCode +
        "\n" +
        languageCodeStub.endSnippet;

      const submission = await this.submissionRepository.createSubmission(
        submissionPayload
      );

      if (!submission) {
        throw new SubmissionCreationError(
          "Failed to save submission to the database."
        );
      }

      const jobPayload = {
        [submission._id]: {
          code: submission.code,
          language: submission.language,
          testCases: problemDetails.testCases,
          userId: submission.userId,
          submissionId: submission._id,
        },
      };

      await SubmissionProducer(jobPayload);

      return { submission };
    } catch (error) {
      console.error("An error occurred in addSubmission:", error);
      throw error;
    }
  }

  async getSubmission(submissionId) {
    const submission = await this.submissionRepository.getSubmission(
      submissionId
    );
    if (!submission) {
      throw new Error("Submission not found");
    }
    return submission;
  }
}

module.exports = SubmissionService;
