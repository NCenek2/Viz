const jwt = require("jsonwebtoken");
const { DEFAULT_EXPIRES_IN_SECONDS } = require("../constants/constants");
module.exports = (payload, secret, expiresIn = DEFAULT_EXPIRES_IN_SECONDS) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  });
  return token;
};
