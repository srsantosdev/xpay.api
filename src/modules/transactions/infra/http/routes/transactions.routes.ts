import { Router } from 'express';
import { TransactionsController } from '../controllers/TransactionsController';
import { DetailUserTransactionsController } from '../controllers/DetailUserTransactionsController';
import { TransactionsSummaryController } from '../controllers/TransactionsSummaryController';

const transactionsRouter = Router();

const transactionsController = new TransactionsController();
const detailUserTransactionsController = new DetailUserTransactionsController();
const transactionsSummaryController = new TransactionsSummaryController();

transactionsRouter.post('/', transactionsController.create);
transactionsRouter.get('/', transactionsController.index);

transactionsRouter.get('/details', detailUserTransactionsController.index);
transactionsRouter.get('/summary', transactionsSummaryController.index);

export default transactionsRouter;
