import { Router } from 'express';
import { Authentication, Varidation } from '../utils/authenticate';

const authenticateRouter = Router();

authenticateRouter
  .post('/', Varidation(), Authentication())
  .all('/', (_req, res, _next) => {
    // 501 Not Implemented
    res.sendStatus(501);
  });
export default authenticateRouter;
