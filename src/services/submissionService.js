const { fetchProblemDetails } = require("../apis/problemAdminApi");
const SubmissionCreationError = require("../errors/SubmissionCreationError");
const SubmissionProducer = require("../producers/submissionQueueProducer");

class SubmissionService {
  constructor(submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async addSubmission(submissionPayload) {
    const problemId = submissionPayload.problemId;
    const userId = submissionPayload.userId;

    const problemAdminApiResponse = await fetchProblemDetails(problemId);

    if (!problemAdminApiResponse || !problemAdminApiResponse.data) {
      // It's good practice to log the actual response for debugging
      console.error('Invalid response from Problem-Service:', problemAdminApiResponse);
      throw new SubmissionCreationError("Failed to get problem details to create the submission");
    }

    const languageCodeStub = problemAdminApiResponse.data.codeStubs.find(
      (codeStub) =>
        codeStub.language.toLowerCase() === submissionPayload.language.toLowerCase()
    );

    if(!languageCodeStub) {
        throw new SubmissionCreationError(`No code stub found for language: ${submissionPayload.language}`);
    }


    submissionPayload.code =
      languageCodeStub.startSnippet +
      "\n\n" +
      submissionPayload.code +
      "\n\n" +
      languageCodeStub.endSnippet;

    const submission = await this.submissionRepository.createSubmission(
      submissionPayload
    );

    if (!submission) {
      throw new SubmissionCreationError(
        "Failed to create a submission in the repository"
      );
    }
    // Log with context
    console.log(`Created submission ${submission._id} for user ${userId} and problem ${problemId}`);


    const response = await SubmissionProducer({
      [submission._id]: {
        code: submission.code,
        language: submission.language,
        inputCase: problemAdminApiResponse.data.testCases[0].input,
        outputCase: problemAdminApiResponse.data.testCases[0].output,
        userId,
        submissionId: submission._id,
      },
    });

    // Log after adding to queue
    console.log(`Successfully added job for submission ${submission._id} to the queue.`);

    return { queueResponse: response, submission };
  }
}

module.exports = SubmissionService;