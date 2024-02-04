const Api400Error = require("../errors/Api400Error");
require("dotenv").config();
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  const BASE_URL = "/api/reports";
  pool.connect();

  //   Get Report By Id
  app.get(BASE_URL, async (req, res, next) => {
    let { cycle_id, user_id } = req.query;
    if (!cycle_id || !user_id)
      return next(new Api400Error("Cycle id or user id is null"));

    cycle_id = parseInt(cycle_id);
    user_id = parseInt(user_id);
    if (!cycle_id || !user_id)
      return next(new Api400Error("Cycle id or user id  must be an integer"));

    const query =
      "SELECT report, report_id, acknowledged FROM reports WHERE cycle_id = $1 AND user_id = $2";

    try {
      const result = await pool.query(query, [cycle_id, user_id]);
      logger.info("Request to get report by id successful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(
        err?.message ?? "Error when attempting to read report by id"
      );
      return next(err);
    }
  });

  // User Reports
  app.get(`${BASE_URL}/user/:user_id`, async (req, res, next) => {
    let { user_id } = req.params;
    if (!user_id) return next(new Api400Error("User id is null"));

    user_id = parseInt(user_id);
    if (!user_id) return next(new Api400Error("User id must be an integer"));

    let query = `SELECT
      r.cycle_id,
      c.start_date
  FROM
      reports r
  JOIN
      cycles c ON r.cycle_id = c.cycle_id`;

    query += " WHERE r.user_id = $1";

    try {
      const result = await pool.query(query, [user_id]);
      logger.info("Request to get user reports sucessful!");
      return res.json(result.rows);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to get user reports");
      return next(err);
    }
  });

  // CREATE Report
  app.post(BASE_URL, async (req, res, next) => {
    let { report, cycle_id, user_id } = req.body;

    if (!report || !cycle_id || !user_id)
      return next(
        new Api400Error("Report, cycle id, or user_id must not be null")
      );

    cycle_id = parseInt(cycle_id);
    user_id = parseInt(user_id);

    const query =
      "INSERT INTO reports (report, cycle_id, user_id, acknowledged) VALUES ($1, $2, $3, $4)";

    try {
      await pool.query(query, [report, cycle_id, user_id, false]);
      logger.info("Successfully created report!");
      return res.sendStatus(201);
    } catch (err) {
      logger.error(err?.message ?? "Error when attempting to create a report");
      return next(err);
    }
  });

  // Acknowledge Report
  app.patch(`${BASE_URL}/acknowledge`, async (req, res, next) => {
    let { user_id: userId } = req;
    let { report_id, user_id } = req.body;

    if (!report_id || !user_id)
      return next(new Api400Error("Report id and user id cannot be null"));

    userId = parseInt(userId);
    report_id = parseInt(report_id);
    user_id = parseInt(user_id);

    if (!report_id || !user_id)
      return next(new Api400Error("Report id and user id must be an integer"));

    if (user_id !== userId)
      return next(new Api400Error("Can't acknowledge another users report"));

    const query =
      "UPDATE reports SET acknowledged = $1 WHERE report_id = $2 AND user_id = $3";

    try {
      await pool.query(query, [true, report_id, user_id]);
      logger.info("Successfully acknowledged report!");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Failed to acknowledge report");
      return next(err);
    }
  });

  // UPDATE Report with Id
  app.patch(`${BASE_URL}/:report_id`, async (req, res, next) => {
    let { report_id } = req.params;
    const { report } = req.body;

    if (!report_id) return next(new Api400Error("Report id cannot be null"));

    report_id = parseInt(report_id);
    if (!report_id)
      return next(new Api400Error("Report id must be an integer"));

    const query = "UPDATE reports SET report = $1 WHERE report_id = $2";

    try {
      await pool.query(query, [report, report_id]);
      logger.info("Successfully updated report!");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Failed to update report");
      return next(err);
    }
  });

  app.delete(`${BASE_URL}/:report_id`, async (req, res, next) => {
    let { report_id } = req.params;
    if (!report_id) return next(new Api400Error("Report id cannot be null"));

    report_id = parseInt(report_id);
    if (!report_id)
      return next(new Api400Error("Report id must be an integer"));

    const query = "DELETE FROM reports WHERE report_id = $1";

    try {
      await pool.query(query, [report_id]);
      logger.info("Successfully deleted report!");
      return res.sendStatus(204);
    } catch (err) {
      logger.error(err?.message ?? "Failed to delete report");
      return next(err);
    }
  });
};
