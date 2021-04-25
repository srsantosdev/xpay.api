import { Router } from 'express';
import { UsersController } from '../controllers/UsersController';
import { UserSessionsController } from '../controllers/UserSessionsController';

const usersRouter = Router();

const usersController = new UsersController();
const userSessionsController = new UserSessionsController();

usersRouter.post('/', usersController.create);
usersRouter.post('/sessions', userSessionsController.create);

export default usersRouter;
