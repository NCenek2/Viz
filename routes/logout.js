const hasToken = require("../middlewares/hasToken");
require("dotenv").config();
const logger = require("../logs/logger");

module.exports = (pool, app) => {
  app.get("/api/logout", async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    const refreshToken = cookies.jwt;

    const findRefreshTokenQuery =
      "SELECT * FROM users WHERE refresh_token = $1";
    let foundUser = null;
    try {
      foundUser = await pool.query(findRefreshTokenQuery, [refreshToken]);
      logger.info("Found User for Logout");
    } catch (err) {
      logger.error(err?.message ?? "Failed when trying to logout");
      return next(err);
    }

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    if (!foundUser.rows.length) return res.sendStatus(204);
    const [user] = foundUser.rows;

    const clearRefreshTokenQuery =
      "UPDATE users SET refresh_token = '' WHERE user_id = $1";

    try {
      await pool.query(clearRefreshTokenQuery, [user.user_id]);
      logger.info("Cleared user refresh token for logout");
    } catch (error) {
      logger.error(
        err?.message ?? "Failed to clear user refresh token when logging out"
      );
      return next(err);
    }

    return res.sendStatus(204);
  });
};
