const Api400Error = require("../errors/Api400Error");
const Api409Error = require("../errors/Api409Error");
const logger = require("../logs/logger");
const hasToken = require("../middlewares/hasToken");

module.exports = (pool, app) => {
  const BASE_URL = "/api/metrics";
  pool.connect();

  // READ All Metric
  app.get(BASE_URL, hasToken, async (req, res, next) => {
    const query = `SELECT * FROM metrics`;

    try {
      const result = await pool.query(query);
      logger.info("Successfully read all metrics");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read all metrics");
      return next(err);
    }
  });

  // READ Metric By Id
  app.get(`${BASE_URL}/:metrics_id`, hasToken, async (req, res, next) => {
    let { metrics_id } = req.params;
    if (!metrics_id)
      return next(new Api400Error("Metrics id cannot be null in parameters"));

    metrics_id = parseInt(metrics_id);
    if (!metrics_id)
      return next(new Api400Error("Metrics id must be an integer"));

    const query = `SELECT * FROM metrics where metrics_id = $1`;

    try {
      const result = await pool.query(query, [metrics_id]);
      logger.info("Successfully read metric by id");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read metric by id");
      return next(err);
    }
  });

  // CREATE Metrics
  app.post(BASE_URL, hasToken, async (req, res, next) => {
    const { metrics_name, metrics_unit } = req.body;
    if (!metrics_name || !metrics_unit)
      return next(new Api400Error("Metrics name or metrics unit is null"));

    try {
      const query = `INSERT INTO metrics (metrics_name, metrics_unit) VALUES ($1, $2)`;
      await pool.query(query, [metrics_name, metrics_unit]);
      logger.info("Successfully created metric");
      return res.sendStatus(201);
    } catch (err) {
      if (err?.code === "23505") {
        logger.warn("Metric with that name already exists!");
        return next(new Api409Error("Metric with that name already exists!"));
      } else {
        logger.error(err?.message ?? "Failed to create metric");
        return next(err);
      }
    }
  });

  // UPDATE Metrics
  app.patch(BASE_URL, hasToken, async (req, res, next) => {
    const { metrics_name, metrics_unit } = req.body;
    let { metrics_id } = req.body;
    if (!metrics_id || !metrics_name || !metrics_unit)
      return next(
        new Api400Error("Metrics id, metrics name, or metrics unit is null")
      );

    metrics_id = parseInt(metrics_id);
    if (!metrics_id)
      return next(new Api400Error("Metrics id must be an integer"));

    const query =
      "UPDATE metrics SET metrics_name = $1, metrics_unit = $2 WHERE metrics_id = $3";

    try {
      await pool.query(query, [metrics_name, metrics_unit, metrics_id]);
      logger.info("Successfully updated metric");
      return res.sendStatus(204);
    } catch (err) {
      if (err?.code === "22P02") {
        logger.warn("Invalid input syntax for type bigint");
        return next(new Api409Error("Invalid input syntax for type bigint"));
      } else {
        logger.error(err?.message ?? "Failed to update metrics");
        return next(err);
      }
    }
  });
};
