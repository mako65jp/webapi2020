import { NextFunction, Request, Response } from 'express';
import { Verify } from '../utils/jwt';

export const tokenGuard = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // get token from body:token or query:token of Http Header:x-access-token
    const token =
      req.headers['x-access-token'] || req.body.token || req.query.token;

    // validate token
    if (!token) {
      res.status(404).send({ success: false, message: 'No token provided.' });
      return;
    }

    const payload = Verify(token) as string | undefined;
    if (!payload) {
      // if token valid -> save token to request for use in other routes
      req.headers.payload = payload;
      
      res.status(404).send({ success: false, message: 'No token provided.' });
      return;
    }

    next();
  };
};