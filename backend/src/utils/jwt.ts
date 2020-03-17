import * as jwt from 'jsonwebtoken';

const _superSecret = 'superSecret';
const jwtOptions: jwt.SignOptions = { algorithm: 'HS256', expiresIn: 12000 };

export const ExpirationTime = () => {
  return Date.now() + Number(jwtOptions.expiresIn);
};

export const Sign = (payload: object) => {
  return jwt.sign(payload, _superSecret, jwtOptions);
};

export const Verify = (token: string) => {
  try {
    return jwt.verify(token, _superSecret) as string | string[] | undefined;
  } catch (e) {
    return;
  }
};
