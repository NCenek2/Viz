module.exports = class BaseError extends Error {
  constructor(message, status) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this);
  }
};
