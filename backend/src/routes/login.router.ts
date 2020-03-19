import { Router } from 'express';
import { Authentication, Varidation } from '../utils/authenticate';

const loginRouter = Router();

loginRouter
  .post('/', Varidation(), Authentication())
  .all('/', (_req, res, _next) => {
    // 501 Not Implemented
    res.sendStatus(501);
    // next();
  });

export default loginRouter;
