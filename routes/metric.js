const Api400Error = require("../errors/Api400Error");
const metrics = require("./metrics");
require("dotenv").config();
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  const BASE_URL = "/api/metric";
  pool.connect();

  app.get(BASE_URL, async (req, res, next) => {
    let { cycle_id, user_id } = req.query;
    if (!cycle_id || !user_id)
      return next(new Api400Error("Cycle id and user id cannot be null"));

    cycle_id = parseInt(cycle_id);
    user_id = parseInt(user_id);
    if (!cycle_id || !user_id)
      return next(new Api400Error("Cycle id or user id must be an integer"));

    let query = `SELECT
    um.metric_id,
    um.metrics_id,
    m.metrics_name,
    m.metrics_unit,
    um.metric_value,
    mc.weight,
    mc.threshold,
    c.start_date
  FROM
    user_metric um
  JOIN
    metrics_criteria mc ON um.criteria_id = mc.criteria_id
  JOIN
    metrics m ON um.metrics_id = m.metrics_id
  JOIN
    users u ON um.user_id = u.user_id
  JOIN
    cycles c ON um.cycle_id = c.cycle_id`;

    query += " WHERE um.cycle_id = $1 AND um.user_id = $2";

    try {
      const result = await pool.query(query, [cycle_id, user_id]);
      logger.info("Successfully retrieved metrics for dashboard");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to retrieve metrics for dashboard");
      return next(err);
    }
  });

  app.get(`${BASE_URL}/user_cycles/:user_id`, async (req, res, next) => {
    let { user_id } = req.params;
    if (!user_id) return next(new Api400Error("User id cannot be null"));

    user_id = parseInt(user_id);
    if (!user_id) return next(new Api400Error("User id must be an integer"));

    let query = `SELECT DISTINCT
    um.cycle_id,
    c.start_date
FROM
    user_metric um
JOIN
    users u ON um.user_id = u.user_id
JOIN
    cycles c ON um.cycle_id = c.cycle_id`;

    query += " WHERE um.user_id = $1";

    try {
      const result = await pool.query(query, [user_id]);
      logger.info("Successfully retrieved user cycles!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to retrieve user cycles");
      return next(err);
    }
  });

  app.get(`${BASE_URL}/cycle_users/:cycle_id`, async (req, res, next) => {
    let { cycle_id } = req.params;
    if (!cycle_id) return next(new Api400Error("Cycle id cannot be null"));

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    let query = `SELECT DISTINCT
    um.user_id,
    u.email
FROM
    user_metric um
JOIN
  users u ON um.user_id = u.user_id
JOIN
  cycles c ON um.cycle_id = c.cycle_id`;

    query += " WHERE um.cycle_id = $1";

    try {
      const result = await pool.query(query, [cycle_id]);
      logger.info("Successfully retrieved cycle's users!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to retrieve cycle's users");
      return next(err);
    }
  });

  // CREATE User Metric
  app.post(BASE_URL, async (req, res, next) => {
    let { metrics_id, cycle_id, user_id } = req.body;

    if (!metrics_id || !cycle_id || !user_id)
      return next(
        new Api400Error("Metrics id, cycle id, or user_id must not be null")
      );

    metrics_id = parseInt(metrics_id);
    cycle_id = parseInt(cycle_id);
    user_id = parseInt(user_id);
    if (!metrics_id || !cycle_id || !user_id)
      return next(
        new Api400Error("Metrics id, Cycle id, and user id must be integers")
      );

    const query =
      "INSERT INTO user_metric (metrics_id, cycle_id, user_id, metric_value) VALUES ($1, $2, $3, $4)";
    try {
      await pool.query(query, [metrics_id, cycle_id, user_id, 0]);
      logger.info("Successfully created user metric!");
      return res.sendStatus(201);
    } catch (err) {
      logger.error(err?.message ?? "Failed to create user metric");
      return next(err);
    }
  });

  // CREATE Cycle User Metric
  app.post(`${BASE_URL}/createcycle`, async (req, res, next) => {
    const { criteria, users, cycle_id } = req.body;

    if (!criteria.length || !users.length)
      return next(
        new Api400Error("No criteria or users were given for the cycle")
      );

    if (!cycle_id)
      return next(
        new Api400Error(
          "Cycle id was not generated properly when creating cycle"
        )
      );

    let index = 1;
    let query =
      "INSERT INTO user_metric (metrics_id, criteria_id, user_id, cycle_id, metric_value) VALUES ";
    let values = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < criteria.length; j++) {
        if (i === 0 && j === 0) {
          query += `($${index++}, $${index++}, $${index++}, $${index++}, $${index++})`;
        } else {
          query += `, ($${index++}, $${index++}, $${index++}, $${index++}, $${index++})`;
        }

        values.push(criteria[j].metrics_id);
        values.push(criteria[j].criteria_id);
        values.push(users[i]);
        values.push(cycle_id);
        values.push(0);
      }
    }

    query += ";";

    try {
      await pool.query(query, values);
      logger.info("Successfully created user metrics for cycle!");
      return res.sendStatus(201);
    } catch (err) {
      logger.error(err?.message ?? "Failed to create user metric for cycle");
      return next(err);
    }
  });

  // UPDATE Multiple User Metrics
  app.patch(`${BASE_URL}/all`, async (req, res, next) => {
    const { updated } = req.body;

    if (!updated)
      return next(new Api400Error("Updated metrics array was null"));

    if (updated.length == 0)
      return next(new Api400Error("Updated metrics array was empty"));

    let values = [];
    let query = "UPDATE user_metric SET ";
    let index = 1;

    let metric_value = "metric_value = CASE";

    for (let i = 0; i < updated.length; i++) {
      metric_value += ` WHEN metric_id = ${
        updated[i].metric_id
      } THEN $${index++}`;

      values.push(updated[i].metric_value);
    }

    metric_value += " ELSE metric_value END ";

    query += metric_value;
    query += ` WHERE metric_id in (`;

    for (let i = 0; i < updated.length; i++) {
      if (i == 0) {
        query += `${updated[i].metric_id}`;
      } else {
        query += `, ${updated[i].metric_id}`;
      }
    }

    query += ");";

    try {
      await pool.query(query, values);
      logger.info("Successfully updated user metrics!");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Failed to update user metrics");
      return next(err);
    }
  });

  // UPDATE User Metric
  app.patch(`${BASE_URL}/:metric_id`, async (req, res, next) => {
    // const id = req.user_id; // temp to check the user editing values
    // is user or if the role is not admin
    let { metric_id } = req.params;
    const { user_id, metric_value } = req.body;
    const id = user_id;

    if (!metric_id || id !== user_id || !metric_value)
      return next(
        new Api400Error("Metric id, id != user id, or metric value is null")
      );

    metric_id = parseInt(metric_id);
    if (!metric_id)
      return next(new Api400Error("Metric id must be an integer"));

    const query =
      "UPDATE user_metric SET metric_value = $1 WHERE metric_id = $2";

    try {
      await pool.query(query, [metric_value, metric_id]);
      logger.info("Successfully updated user metric by id!");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Failed to update user metric by id");
      return next(err);
    }
  });
};
