import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import transactionsRouter from '@modules/transactions/infra/http/routes/transactions.routes';

const appRouter = Router();

appRouter.use('/users', usersRouter);
appRouter.use('/transactions', transactionsRouter);

export default appRouter;
