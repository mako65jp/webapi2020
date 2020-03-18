import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken, decodeToken } from './jwt';

const getExprationTime = (payload: any) => {
  if (!payload || !payload.exp) {
    return 0;
  }
  return payload.exp * 1000;
};

export const Varidation = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errMessage = [];

    const email = '' + req.body['email'];
    const userPass = '' + req.body['password'];

    if (email === '') {
      errMessage.push('email is invalid.');
    }
    if (userPass === '') {
      errMessage.push('password is invalid.');
    }

    if (errMessage.length > 0) {
      // 404 Not Found
      res.status(404).json({
        success: false,
        message: errMessage,
      });
      return;
    }

    req.body['email'] = email;
    req.body['password'] = userPass;

    next();
  };
};

export const Authentication = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.body['email'];
      const userPass = req.body['password'];

      const users = await User.scope('login').findAll({
        where: { email: email },
      });

      if (users.length != 1) {
        // 404 Not Found
        res.status(404).json({
          success: false,
          message: 'Authentication failed.',
        });
        return;
      }

      const user = users[0];
      if (await user.comparePassword(userPass)) {
        const token = generateToken({ email: email, isAdmin: user.isAdmin });
        const exprationTime = getExprationTime(decodeToken(token));
        user.setExprationTime(exprationTime).save();

        if (exprationTime > 0) {
          res.json({
            success: true,
            message: 'Authentication successfully finished',
            token: token,
          });
          return;
        }
      }

      // 404 Not Found
      res.status(404).json({
        success: false,
        message: 'Authentication failed.',
      });
    } catch (e) {
      next(e);
    }
  };
};

export const VerifyToken = (token: string) => {
  const payload = decodeToken(token);
  if (!payload) {
    return;
  }

  const exp = getExprationTime(payload);
  if (exp > new Date().valueOf()) {
    return payload;
  }

  return;
};
