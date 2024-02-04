const Api401Error = require("../errors/Api401Error");
const jwt = require("jsonwebtoken");
const createToken = require("../miscellaneous/createToken");
const keys = require("../config/keys");
const logger = require("../logs/logger");
const { ACCESS_TOKEN_EXPIRES_IN_SECONDS } = require("../constants/constants");
require("dotenv").config();

module.exports = (app) => {
  app.get("/api/refresh", (req, res, next) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
      logger.error("Cookie does not exist to refresh");
      return next(new Api401Error("Cookie does not exist to refresh"));
    }

    const refreshToken = cookies.jwt;

    // 403 if cant findRefreshtoken with refreshToken
    let payload = {};
    let refreshError = null;

    jwt.verify(refreshToken, keys.REFRESH_TOKEN_KEY, (err, decoded) => {
      if (err) {
        // Add or decoded.user_id != foundUser.user_id
        refreshError = err;
        return;
      }

      const { user_id, email, role } = decoded;
      payload = {
        user_id,
        email,
        role,
      };
    });

    if (refreshError != null) {
      logger.warn(
        refreshError?.message ?? "Error when verifying refresh token"
      );
      return next(
        new Api401Error(
          refreshError?.message ?? "Error when verifying refresh token"
        )
      );
    }
    const accessToken = createToken(
      payload,
      keys.ACCESS_TOKEN_KEY,
      ACCESS_TOKEN_EXPIRES_IN_SECONDS
    );
    logger.info("Successfully refreshed and created an access token!");
    return res.json({
      userInfo: payload,
      accessToken,
    });
  });
};
