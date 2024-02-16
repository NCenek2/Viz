import { genSalt, hash as hashWithSalt, compare } from 'bcrypt';
import { HASHES } from 'src/constants/constants';

export const hashPassword = async (password: string) => {
  const salt = await genSalt(HASHES.SALT_ROUNDS);
  const hash = await hashWithSalt(password, salt);

  return hash;
};

export const comparePassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};
