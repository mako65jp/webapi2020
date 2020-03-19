import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const tokenGuard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // get token from body:token or query:token of Http Header:x-access-token
  const token: string =
    req.headers['x-access-token'] || req.body.token || req.query.token;

  // validate token
  if (!token) {
    res.status(404).send({ success: false, message: 'No token provided.' });
    return;
  }

  const payload = verifyToken(token) as string | string[] | undefined;
  if (!payload) {
    res.status(404).send({ success: false, message: 'No token provided.' });
    return;
  }

  // if token valid -> save token to request for use in other routes
  req.headers.payload = payload;

  next();
};
