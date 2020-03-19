import { NextFunction, Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from './jwt';

export const Varidation = () => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const email = req.body['email'];
      const userPass = req.body['password'];

      const users = await User.scope('withPassword').findAll({
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

      const user = new User(users[0]);
      if (await User.comparePassword(userPass, user.password)) {
        const token = generateToken({
          id: users[0].id,
          email: email,
          isAdmin: user.isAdmin,
        });

        res.json({
          success: true,
          message: 'Authentication successfully finished.',
          token: token,
        });
        return;
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
