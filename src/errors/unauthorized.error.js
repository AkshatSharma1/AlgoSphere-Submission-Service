const BaseError = require('./BaseError');
const { StatusCodes } = require('http-status-codes');

class UnauthorizedError extends BaseError {
    constructor(details) {
        super("UnauthorizedError", StatusCodes.UNAUTHORIZED, `Authentication failed`, details);
    }
}

module.exports = UnauthorizedError;