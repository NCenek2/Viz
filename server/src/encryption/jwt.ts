import jwt from 'jsonwebtoken';
import { TOKENS } from 'src/constants/constants';

// const { DEFAULT_EXPIRES_IN_SECONDS } = require('../constants/constants');
export const signToken = (
  payload: any,
  expiresIn: number = TOKENS.DEFAULT_EXPIRES_IN_SECONDS,
) => {
  const token = jwt.sign(payload, TOKENS.JSON_WEB_TOKEN_SECRET, {
    expiresIn,
  });
  return token;
};
