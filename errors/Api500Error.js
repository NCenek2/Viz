const BaseError = require("./BaseError");
const httpStatusCodes = require("./HttpCodes");

class Api500Error extends BaseError {
  constructor(
    message = "Interal Service Error",
    status = httpStatusCodes.INTERNAL_SERVER
  ) {
    super(message, status);

    this.message = message;
    this.status = status;
  }
}

module.exports = Api500Error;
