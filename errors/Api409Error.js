const BaseError = require("./BaseError");
const httpStatusCodes = require("./HttpCodes");

class Api409Error extends BaseError {
  constructor(message = "Conflict", status = httpStatusCodes.CONFLICT) {
    super(message, status);

    this.message = message;
    this.status = status;
  }
}

module.exports = Api409Error;
