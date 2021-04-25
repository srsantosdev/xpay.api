import { container } from 'tsyringe';

import { TransactionsRepository } from '../infra/typeorm/repositories/TransactionsRepository';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);
