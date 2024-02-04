const { hashPassword } = require("../miscellaneous/hashing");
const Api400Error = require("../errors/Api400Error");
const Api409Error = require("../errors/Api409Error");
const logger = require("../logs/logger");
const keys = require("../config/keys");

module.exports = (pool, app) => {
  app.post(`/api/register`, async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new Api400Error("Email and password must have a value"));

    let { username, companyKey } = req.body;
    if (!username) return next(new Api400Error("Username cannot be empty"));

    if (companyKey !== keys.COMPANY_KEY)
      return next(new Api400Error("Invalid Key"));

    let hashedPassword = hashPassword(password);
    const query = `INSERT INTO users (email, password, role${
      username ? ", username" : ""
    }) VALUES ($1, $2, $3${username ? ", $4" : ""})`;

    const userData = [email, hashedPassword, 1];
    if (username) userData.push(username);

    try {
      await pool.query(query, userData);
      logger.info("Successfully registered user!");
      return res.sendStatus(201);
    } catch (err) {
      if (err?.code === "23505") {
        logger.warn("User with that email already exists");
        return next(new Api409Error("User with that email already exists"));
      } else {
        logger.error(err?.message ?? "Error when registering user");
        return next(err);
      }
    }
  });
};
