const Api400Error = require("../errors/Api400Error");
const Api409Error = require("../errors/Api409Error");
const isAuthorized = require("../middlewares/isAuthorized");
const hasToken = require("../middlewares/hasToken");
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  const BASE_URL = "/api/current_cycle";
  app.use(hasToken);
  pool.connect();

  // READ Current Cycle
  app.get(BASE_URL, async (req, res, next) => {
    // const query = "SELECT * from current_cycle";

    let query = `SELECT
    cc.cycle_id,
    c.start_date
FROM
    current_cycle cc
JOIN
    cycles c ON cc.cycle_id = c.cycle_id`;

    try {
      const result = await pool.query(query);

      if (!result.rows.length) return res.json([]);

      const [data] = result.rows;
      logger.info("Successfully read current cycle");
      return res.json(data);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read current cycle");
      return next(err);
    }
  });

  // Get Count
  // READ Current Cycle
  app.get(`${BASE_URL}/count`, async (req, res, next) => {
    // const query = "SELECT * from current_cycle";

    try {
      const countQuery = "SELECT Count(*) FROM current_cycle";
      const countData = await pool.query(countQuery);
      if (!countData.rows.length) {
        logger.error(err?.message ?? "Count Data Should Exist");
        return next(new Api400Error("Count Data Should Exist"));
      }

      let count = countData.rows[0]?.count ?? 0;
      count = parseInt(count);

      logger.info("Successfully read current cycle count");

      return res.json(count);
    } catch (err) {
      logger.error(err?.message ?? "Failed to get count of current cycle");
      return next(err);
    }
  });

  // UPDATE Current Cycle
  app.patch(`${BASE_URL}/:cycle_id`, async (req, res, next) => {
    let { cycle_id } = req.params;
    if (!cycle_id) return next(new Api400Error("Cycle id cannot be null"));

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    const query = "UPDATE current_cycle SET cycle_id = $1";

    try {
      await pool.query(query, [cycle_id]);
      logger.info("Successfully updated current cycle!");
      return res.sendStatus(204);
    } catch (err) {
      if (err?.code === "23503") {
        logger.warn("Cycle_id doesnt exist to replace");
        return next(new Api409Error("Cycle_id doesnt exist to replace"));
      }
      logger.error(err?.message ?? "Failed to update current cycle");
      return next(err);
    }
  });
};
