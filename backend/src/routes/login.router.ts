import { Router } from 'express';
import { Varidation, Authentication } from '../utils/authenticate';

const loginRouter = Router();

loginRouter
    .post('/', Varidation(), Authentication());

export default loginRouter;