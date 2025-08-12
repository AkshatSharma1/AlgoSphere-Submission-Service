const { StatusCodes } = require("http-status-codes");
const BaseError = require("../errors/BaseError");

function errorHandler(err, req, reply){
    if(err instanceof BaseError){
        reply.status(err.statusCode).send({
            success: false,
            message: err.message,
            error: err.details,
            data: {}
        });
    }
    else{
        reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
            success: false,
            message: "Internal Server Error",
            error: "Not able to process",
            data: {}
        })
    }
}

module.exports = errorHandler;