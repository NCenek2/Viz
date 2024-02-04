const BaseError = require("./BaseError");
const httpStatusCodes = require("./HttpCodes");

class Api404Error extends BaseError {
  constructor(message = "Bad Request", status = httpStatusCodes.BAD_REQUEST) {
    super(message, status);

    this.message = message;
    this.status = status;
  }
}

module.exports = Api404Error;
