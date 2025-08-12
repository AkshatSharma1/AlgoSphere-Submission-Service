const { StatusCodes } = require("http-status-codes");
const BaseError = require("./BaseError");

class SubmissionCreationError extends BaseError{
    constructor(details){
        super("Failed to submit code", StatusCodes.BAD_REQUEST, details)
    }
}

module.exports = SubmissionCreationError;