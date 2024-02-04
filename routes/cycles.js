const Api400Error = require("../errors/Api400Error");
const Api409Error = require("../errors/Api409Error");
const hasToken = require("../middlewares/hasToken");
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  const BASE_URL = "/api/cycles";
  pool.connect();

  // READ All Cycles
  app.get(BASE_URL, hasToken, async (req, res, next) => {
    const query = `SELECT * FROM cycles`;
    try {
      const result = await pool.query(query);
      logger.info("Successfully read all cycles");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read all cycles");
      return next(err);
    }
  });

  // READ Cycle By Id
  app.get(`${BASE_URL}/:cycle_id`, hasToken, async (req, res, next) => {
    let { cycle_id } = req.params;
    if (!cycle_id) return next(new Api400Error("Cycle id is null"));

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    const query = `SELECT * FROM metrics where cycle_id = $1`;

    try {
      const result = await pool.query(query, [cycle_id]);
      logger.info("Successfully read cycle by id");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Failed to read cycle by id");
      return next(err);
    }
  });

  // CREATE Cycles
  app.post(BASE_URL, hasToken, async (req, res, next) => {
    const { start_date } = req.body;
    if (!start_date || !/\d{4}-\d{2}-\d{2}/.test(start_date))
      return next(
        new Api400Error("Date is empty or doesn't match the form ####-##-##")
      );

    try {
      const countQuery = "SELECT Count(*) FROM current_cycle";
      const countData = await pool.query(countQuery);
      if (!countData.rows.length) {
        throw next(new Api400Error("CounData Should Exist"));
      }

      let count = countData.rows[0]?.count ?? 0;
      count = parseInt(count);

      const query = `INSERT INTO cycles (start_date) VALUES ($1) RETURNING cycle_id`;
      const result = await pool.query(query, [start_date]);

      if (result.rows.length > 0) {
        const newCycleId = result.rows[0].cycle_id;

        // Means First Cycle Hasn't Been Created
        if (count === 0) {
          const firstCycleQuery =
            "INSERT INTO current_cycle (cycle_id) VALUES ($1)";
          await pool.query(firstCycleQuery, [newCycleId]);
          logger.info("Successfully created first cycle!");
        }
        logger.info("Successfully created cycle!");
        return res.status(201).send(newCycleId);
      }
    } catch (err) {
      if (err?.code === "23505") {
        logger.warn("Cannot have multiple cycles with the same start date!");
        return next(
          new Api409Error(
            "Cannot have multiple cycles with the same start date!"
          )
        );
      }
      logger.error(err?.message ?? "Failed to read cycle by id");
      return next(err);
    }
  });

  // UPDATE Cycles
  app.patch(`${BASE_URL}/:cycle_id`, hasToken, async (req, res, next) => {
    let { cycle_id } = req.params;
    const { start_date, leader_id } = req.body;
    if (!cycle_id || !start_date || !/\d{4}-\d{2}-\d{2}/.test(start_date))
      return res.sendStatus(400);

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    const query = `UPDATE cycles SET start_date = $1, leader_id = $2 WHERE cycle_id = $3`;
    let leaderId = !leader_id ? null : leader_id;

    try {
      await pool.query(query, [start_date, leaderId, cycle_id]);
      return res.sendStatus(204);
    } catch (err) {
      if (err?.code === "22P02") {
        return next(new Api409Error("Invalid input syntax for type bigint"));
      } else {
        return next(err);
      }
    }
  });

  // DELETE Cycles
  app.delete(`${BASE_URL}/:cycle_id`, hasToken, async (req, res, next) => {
    let { cycle_id } = req.params;
    if (!cycle_id) return next(new Api400Error("Cycle id cannot be null"));

    cycle_id = parseInt(cycle_id);
    if (!cycle_id) return next(new Api400Error("Cycle id must be an integer"));

    const query = "DELETE FROM cycles WHERE cycle_id = $1";

    try {
      await pool.query(query, [cycle_id]);
      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  });
};
