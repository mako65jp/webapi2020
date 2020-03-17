import * as jwt from 'jsonwebtoken';

const _superSecret = 'superSecret';
const options: jwt.SignOptions = { algorithm: 'HS256', expiresIn: 120 };

export const Sign = (payload: object) => {
  return jwt.sign(payload, _superSecret, options);
};

export const Verify = (token: string) => {
  try {
    return jwt.verify(token.toString(), _superSecret);
  } catch (e) {
    return;
  }
};
