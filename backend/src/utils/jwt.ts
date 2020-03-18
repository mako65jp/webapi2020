import * as jwt from 'jsonwebtoken';

const _superSecret = 'superSecret';
const jwtOptions: jwt.SignOptions = { algorithm: 'HS256', expiresIn: 30000 };

export const generateToken = (payload: object) => {
  return jwt.sign(payload, _superSecret, jwtOptions);
};

export const decodeToken = (token: string) => {
  try {
    return jwt.verify(token, _superSecret);
  } catch (e) {
    return;
  }
};
