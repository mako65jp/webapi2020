import { Router } from 'express';

import authenticateRouter from './authenticate.router';
import usersRouter from './users.router';
import { tokenGuard } from '../middleware/tokenGuard';

const router = Router();

router.use('/authenticate', authenticateRouter);

router.use(tokenGuard);

router.use('/users', usersRouter);

export default router;
