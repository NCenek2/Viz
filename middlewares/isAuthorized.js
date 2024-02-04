const logger = require("../logs/logger");
module.exports = (roleLimit) => {
  return (req, res, next) => {
    if (req.role < roleLimit) {
      logger.error(`${req.user} is unauthorized for request`);
      return res.sendStatus(401);
    }
    next();
  };
};
