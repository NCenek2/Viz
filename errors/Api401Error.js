const BaseError = require("./BaseError");
const httpStatusCodes = require("./HttpCodes");

class Api401Error extends BaseError {
  constructor(message = "Unauthorized", status = httpStatusCodes.UNAUTHORIZED) {
    super(message, status);

    this.message = message;
    this.status = status;
  }
}

module.exports = Api401Error;
