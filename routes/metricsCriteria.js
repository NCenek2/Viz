const Api400Error = require("../errors/Api400Error");
const logger = require("../logs/logger");
const hasToken = require("../middlewares/hasToken");

module.exports = (pool, app) => {
  const BASE_URL = "/api/metrics_criteria";
  app.use(hasToken);
  pool.connect();

  app.get(`${BASE_URL}/rankings/:cycle_id`, async (req, res, next) => {
    let { cycle_id } = req.params;
    if (!cycle_id) return next(new Api400Error("Cycle id cannot be null"));

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    // got rid of     um.cycle_id, um.user_id,
    let query = `SELECT
    u.email,
    um.metric_value,
    mc.weight,
    mc.threshold
FROM
    user_metric um
JOIN
    metrics_criteria mc ON um.criteria_id = mc.criteria_id
JOIN
    users u ON um.user_id = u.user_id`;

    query += " WHERE um.cycle_id = $1";

    try {
      const result = await pool.query(query, [cycle_id]);
      logger.info("Successfully gathered ranking data!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to gather ranking data");
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
      logger.info("Successfully gathered users in a specified cycle");
      return res.json(result.rows);
    } catch (err) {
      logger.error(
        err?.message ?? "Failed to gather users in a specified cycle"
      );
      return next(err);
    }
  });

  // READ All Criteria
  app.get(BASE_URL, async (req, res, next) => {
    const query = `SELECT * FROM metrics_criteria`;
    try {
      const result = await pool.query(query);
      logger.info("Successfully read all metrics criteria");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read all metrics criteria");
      return next(err);
    }
  });

  // CREATE Metrics Criteria
  app.post(BASE_URL, async (req, res, next) => {
    let { metrics_id, weight, threshold } = req.body;

    if (!metrics_id || !weight || !threshold)
      return next(
        new Api400Error("Metrics id, weight, or threshold must not be null")
      );

    metrics_id = parseInt(metrics_id);
    weight = parseFloat(weight);
    threshold = parseFloat(threshold);

    if (!metrics_id || !weight || !threshold)
      return next(
        new Api400Error("Metrics id, weight, or threshold are not numbers")
      );

    const query =
      "INSERT INTO metrics_criteria (metrics_id, weight, threshold) VALUES ($1, $2, $3)";

    try {
      await pool.query(query, [metrics_id, weight, threshold]);
      logger.info("Successfully created metrics criteria");
      return res.sendStatus(201);
    } catch (err) {
      logger.error(err?.message ?? "Failed to create metrics criteria");
      return next(err);
    }
  });

  // CREATE Metrics Criteria For Cycle
  app.post(`${BASE_URL}/createcycle`, async (req, res, next) => {
    const { criteria } = req.body;

    if (!criteria || !criteria.length)
      return next(new Api400Error("No cycle criteria were given"));

    const findCriteriaQuery =
      "SELECT metrics_id, criteria_id FROM metrics_criteria WHERE weight = $1 AND threshold = $2 AND metrics_id = $3";

    const addedCriteriaQuery =
      "INSERT INTO metrics_criteria (weight, threshold, metrics_id) VALUES ($1, $2, $3) RETURNING metrics_id, criteria_id";

    const returnData = [];

    try {
      for (let crit of criteria) {
        const { weight, threshold, metrics_id } = crit;
        const queryData = [weight, threshold, metrics_id];
        const result1 = await pool.query(findCriteriaQuery, queryData);
        if (result1.rows.length < 1) {
          const result2 = await pool.query(addedCriteriaQuery, queryData);
          if (result2.rows.length) {
            const [addedCriteria] = result2.rows;
            returnData.push(addedCriteria);
          }
        } else {
          const [addedCriteria] = result1.rows;
          returnData.push(addedCriteria);
        }
      }
      logger.info("Successfully created metrics criteria for cycle");
      return res.json(returnData);
    } catch (err) {
      logger.error(
        err?.message ?? "Failed to create metrics criteria for cycle"
      );
      return next(err);
    }
  });
};
