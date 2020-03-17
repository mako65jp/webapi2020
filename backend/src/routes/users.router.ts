import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter
  .route('/')
  .get(usersController.index)
  .post(usersController.create);

usersRouter
  .route('/:id')
  .get(usersController.show)
  .put(usersController.update)
  .delete(usersController.delete);

usersRouter.route('/:id/logout')
  .get(usersController.logout);

export default usersRouter;
