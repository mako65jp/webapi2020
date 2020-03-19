import * as jwt from 'jsonwebtoken';

const _superSecret = 'superSecret';
const jwtOptions: jwt.SignOptions = { algorithm: 'HS256', expiresIn: 30000 };

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, _superSecret, jwtOptions);
};

export const verifyToken = (token: string): object | undefined => {
  try {
    return jwt.verify(token, _superSecret) as object;
  } catch {
    return;
  }
};
