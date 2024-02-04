const { comparePassword } = require("../miscellaneous/hashing");
const createToken = require("../miscellaneous/createToken");
const Api400Error = require("../errors/Api400Error");
const Api401Error = require("../errors/Api401Error");
const Api500Error = require("../errors/Api500Error");
const keys = require("../config/keys");
const logger = require("../logs/logger");
const {
  ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  REFRESH_TOKEN_EXPIRES_IN_SECONDS,
  HTTP_ONLY_COOKIE_EXPIRES_IN_SECONDS,
} = require("../constants/constants");

module.exports = (pool, app) => {
  const BASE_URL = "/api/auth";
  pool.connect();

  app.post(`${BASE_URL}/login`, async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new Api400Error("Username and password should have values"));

    let result;
    try {
      const query = `SELECT * from users where email = $1`;
      result = await pool.query(query, [email]);
      if (!result.rows.length) return next(new Api401Error());
    } catch (err) {
      logger.error(err?.message ?? "Failed to get user by email");
      return next(err);
    }

    const [user] = result.rows;
    const isPassword = comparePassword(password, user.password);

    if (!isPassword) return next(new Api401Error());

    const { user_id, role } = user;
    const payload = { user_id, email, role };

    const accessToken = createToken(
      payload,
      keys.ACCESS_TOKEN_KEY,
      ACCESS_TOKEN_EXPIRES_IN_SECONDS
    );

    const refreshToken = createToken(
      payload,
      keys.REFRESH_TOKEN_KEY,
      REFRESH_TOKEN_EXPIRES_IN_SECONDS
    );

    const query = "UPDATE users SET refresh_token = $1 WHERE user_id = $2";

    try {
      await pool.query(query, [refreshToken, user.user_id]);
    } catch (error) {
      logger.error(err?.message ?? "Failed to update refresh token on login");
      return next(new Api500Error());
    }

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: HTTP_ONLY_COOKIE_EXPIRES_IN_SECONDS,
    });

    logger.info("Successfully logged in user");
    return res.json({
      userInfo: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  });
};
