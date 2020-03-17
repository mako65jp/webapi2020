import * as jwt from 'jsonwebtoken';

const _superSecret = 'superSecret';
const jwtOptions: jwt.SignOptions = { algorithm: 'HS256', expiresIn: 120 };

export const ExpirationTime = () => {
  return new Date().getMilliseconds() + Number(jwtOptions.expiresIn);
};

export const Sign = (payload: object) => {
  return jwt.sign(payload, _superSecret, jwtOptions);
};

export const Verify = (token: string) => {
  try {
    return jwt.verify(token.toString(), _superSecret);
  } catch (e) {
    return;
  }
};
