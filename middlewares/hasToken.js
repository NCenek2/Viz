const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const logger = require("../logs/logger");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, keys.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      logger.error(err?.message ?? "Cannot validate token. Forbidden");
      return res.sendStatus(403); // Invalid Token
    }

    req.user_id = decoded.user_id;
    req.role = decoded.role;
    next();
  });
};
