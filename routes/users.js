const Api400Error = require("../errors/Api400Error");
const isAuthorized = require("../middlewares/isAuthorized");
require("dotenv").config();
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  const BASE_URL = "/api/users";
  pool.connect();

  // READ ALL Users
  app.get(BASE_URL, isAuthorized(2), async (req, res, next) => {
    const query = "SELECT * from users";

    try {
      const result = await pool.query(query);
      logger.info("Request to real all users sucessful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to read all users");
      return next(err);
    }
  });

  // Read Dashboard Users
  app.get(`${BASE_URL}/dashboard`, async (req, res, next) => {
    const { role, user_id } = req;

    const queryData = [];
    let query = "";
    if (role >= 2) {
      query = `SELECT user_id, email FROM users`;
    } else {
      query = `SELECT user_id, email FROM users WHERE user_id = $1`;
      queryData.push(user_id);
    }

    try {
      const result = await pool.query(query, queryData);
      logger.info("Request to real all dashboard users sucessful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(
        err?.message ?? "Error when attempting to read dashboard users"
      );
      return next(err);
    }
  });

  // Read Access Users
  app.get(`${BASE_URL}/access`, isAuthorized(2), async (req, res, next) => {
    const query = `SELECT user_id, email, role FROM users`;

    try {
      const result = await pool.query(query);
      logger.info("Request to read all access users sucessful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(
        err?.message ?? "Error when attempting to read access users"
      );
      return next(err);
    }
  });

  // READ User By Id
  app.get(`${BASE_URL}/:user_id`, async (req, res, next) => {
    let { user_id } = req.params;
    if (!user_id) return next(new Api400Error("User id cannot be null"));

    user_id = parseInt(user_id);
    if (!user_id) return next(new Api400Error("User id must be an integer"));

    const query = `SELECT * FROM users where user_id = $1`;

    try {
      const result = await pool.query(query, [user_id]);
      logger.info("Request to real user by id sucessful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to read user by id");
      return next(err);
    }
  });

  // UPDATE User Role
  app.patch(`${BASE_URL}/access`, isAuthorized(2), async (req, res, next) => {
    const { user_id, role } = req.body;
    if (!user_id || !role)
      return next(new Api400Error("User Id or role is empty"));

    const query = "UPDATE users SET role = $1 WHERE user_id = $2";

    try {
      await pool.query(query, [role, user_id]);
      logger.info("Changed user role successfully");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to update user role");
      return next(err);
    }
  });

  // UPDATE Username, haveToCheck role for role part, but username is fine
  app.patch(`${BASE_URL}/:user_id`, async (req, res, next) => {
    const { username } = req.body;
    let { user_id } = req.params;

    if (!user_id) return next(new Api400Error("User_id cannot be null"));

    user_id = parseInt(user_id);
    if (!user_id) return next(new Api400Error("User_id must be an integer"));

    const query = "UPDATE users SET username = $1 WHERE user_id = $2";

    try {
      await pool.query(query, [username, user_id]);
      logger.info("Updated username successfully");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to update username");
      return next(err);
    }
  });
};
