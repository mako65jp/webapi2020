import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { Sign } from './jwt';

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
      if (user.comparePassword(userPass)) {
        user.setExprationTime().save();
        res.json({
          success: true,
          message: 'Authentication successfully finished',
          token: Sign({ email: email, isAdmin: user.isAdmin }),
        });
      } else {
        // 404 Not Found
        res.status(404).json({
          success: false,
          message: 'Authentication failed.',
        });
      }
    } catch (e) {
      next(e);
    }
  };
};
