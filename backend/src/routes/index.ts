import { Router } from 'express';
import { tokenGuard } from '../middleware/tokenGuard';
import loginRouter from './login.router';
import usersRouter from './users.router';

const router = Router();

router.use('/login', loginRouter);

router.use(tokenGuard);

router.use('/users', usersRouter);

export default router;
