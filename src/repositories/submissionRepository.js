const Submission = require("../models/submissionModel");

class SubmissionRepository {
  constructor() {
    this.submissionModel = Submission;
  }

  async createSubmission(submission) {
    const response = await this.submissionModel.create(submission);
    return response;
  }

  // New method to get a submission by its ID
  async getSubmission(submissionId) {
    const response = await this.submissionModel.findById(submissionId);
    return response;
  }
}

module.exports = SubmissionRepository;