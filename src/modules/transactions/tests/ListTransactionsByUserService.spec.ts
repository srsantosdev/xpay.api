import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';

import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { ListTransactionsByUserService } from '../services/ListTransactionsByUserService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeUsersRepository: FakeUsersRepository;

let listTransactionsByUserService: ListTransactionsByUserService;

describe('List Transactions By User', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listTransactionsByUserService = new ListTransactionsByUserService(
      fakeTransactionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to list all transactions', async () => {
    const user = await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    const transaction1 = await fakeTransactionsRepository.create({
      amount: 300,
      category: 'Compras',
      date: new Date(),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    const transaction2 = await fakeTransactionsRepository.create({
      amount: 279,
      category: 'Compras',
      date: new Date(),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    const transaction3 = await fakeTransactionsRepository.create({
      amount: 1000,
      category: 'Freelancer',
      date: new Date(),
      description: 'Desenvolvimento de app',
      type: 'income',
      user_id: user.id,
    });

    const transactions = await listTransactionsByUserService.run({
      user_id: user.id,
    });

    expect(transactions).toEqual(
      expect.arrayContaining([transaction1, transaction2, transaction3]),
    );
  });

  it('should not be able to list all transactions if user not found', async () => {
    await expect(
      listTransactionsByUserService.run({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
