// src/services/submissionService.js (with enhanced debugging)

const { fetchProblemDetails } = require("../apis/problemAdminApi");
const SubmissionCreationError = require("../errors/SubmissionCreationError");
const SubmissionProducer = require("../producers/submissionQueueProducer");

class SubmissionService {
  constructor(submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async addSubmission(submissionPayload) {
    try {
      console.log("DEBUG: --- Inside addSubmission ---");
      const problemId = submissionPayload.problemId;
      console.log(`DEBUG: 1. Fetching details for problemId: ${problemId}`);

      // Potential Failure Point 1: API call to Problem-Service
      const problemAdminApiResponse = await fetchProblemDetails(problemId);

      if (!problemAdminApiResponse || !problemAdminApiResponse.data) {
        console.error(
          "DEBUG: ERROR - Invalid or empty response from Problem-Service."
        );
        throw new SubmissionCreationError(
          "Failed to get valid problem details."
        );
      }
      console.log("DEBUG: 2. Successfully fetched problem details.");

      // Combine code with snippets
      const languageCodeStub = problemAdminApiResponse.data.codeStubs.find(
        (codeStub) =>
          codeStub.language.toLowerCase() ===
          submissionPayload.language.toLowerCase()
      );

      if (!languageCodeStub) {
        console.error(
          `DEBUG: ERROR - No code stub found for language: ${submissionPayload.language}`
        );
        throw new SubmissionCreationError(
          `No code stub found for language: ${submissionPayload.language}`
        );
      }

      submissionPayload.code =
        languageCodeStub.startSnippet +
        "\n\n" +
        submissionPayload.code +
        "\n\n" +
        languageCodeStub.endSnippet;

      console.log("DEBUG: 3. Code combined with snippets.");

      // Potential Failure Point 2: Database write
      const submission = await this.submissionRepository.createSubmission(
        submissionPayload
      );
      if (!submission) {
        console.error(
          "DEBUG: ERROR - Failed to create submission in the repository (DB write returned null)."
        );
        throw new SubmissionCreationError(
          "Failed to save submission to the database."
        );
      }
      console.log(
        `DEBUG: 4. Submission saved to DB with ID: ${submission._id}`
      );

      // Create job payload
      const jobPayload = {
        [submission._id]: {
          code: submission.code,
          language: submission.language,
          testCases: problemAdminApiResponse.data.testCases,
          userId: submission.userId,
          submissionId: submission._id,
        },
      };

      // Potential Failure Point 3: Adding job to Redis queue
      await SubmissionProducer(jobPayload);
      console.log("DEBUG: 5. Job successfully added to the queue.");

      return { submission };
    } catch (error) {
      // This will now catch any error from the steps above and log it clearly.
      console.error("DEBUG: --- An error occurred in addSubmission ---");
      console.error("DEBUG: The specific error is:", error); // Log the full error object
      console.error("-------------------------------------------------");

      // Re-throw the error so the global error handler can create the 500 response.
      throw error;
    }
  }
}

module.exports = SubmissionService;
