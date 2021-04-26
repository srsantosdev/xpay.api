import { container } from 'tsyringe';

import '@shared/container/providers';

import { UsersRepository } from '@modules/users/infra/typeorm/repositories/UsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import { TransactionsRepository } from '@modules/transactions/infra/typeorm/repositories/TransactionsRepository';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITransactionsRepository>(
  'TransactionsRepository',
  TransactionsRepository,
);
