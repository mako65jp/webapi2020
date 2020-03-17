import { Router } from 'express';

import authenticateRouter from './authenticate.router';
import loginRouter from './login.router';
import usersRouter from './users.router';
import { tokenGuard } from '../middleware/tokenGuard';

const router = Router();

router.use('/login', loginRouter);

router.use(tokenGuard);

router.use('/authenticate', authenticateRouter);
router.use('/users', usersRouter);

export default router;
