import { set as setDate } from 'date-fns';
import AppError from '@shared/errors/AppError';

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { DetailUserTransactionsByDateService } from '../services/DetailUserTransactionsByDateService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeUsersRepository: FakeUsersRepository;

let detailUserTransactionsByDateService: DetailUserTransactionsByDateService;

describe('Detail User Transactions By Date', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    detailUserTransactionsByDateService = new DetailUserTransactionsByDateService(
      fakeTransactionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to show detail user transactions by date', async () => {
    const user = await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    const transaction1 = await fakeTransactionsRepository.create({
      amount: 300,
      category: 'Compras',
      date: new Date(2021, 3, 21),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    const transaction2 = await fakeTransactionsRepository.create({
      amount: 279,
      category: 'Compras',
      date: new Date(2021, 3, 22),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    const transaction3 = await fakeTransactionsRepository.create({
      amount: 1000,
      category: 'Freelancer',
      date: new Date(2021, 3, 24),
      description: 'Desenvolvimento de app',
      type: 'income',
      user_id: user.id,
    });

    const transaction4 = await fakeTransactionsRepository.create({
      amount: 300,
      category: 'Prestação de serviços',
      date: new Date(2021, 3, 21),
      description: 'Empresa X',
      type: 'income',
      user_id: user.id,
    });

    const transactionsByDate = await detailUserTransactionsByDateService.run({
      user_id: user.id,
    });

    const resetDateConfig = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    };

    expect(transactionsByDate).toEqual(
      expect.arrayContaining([
        {
          date: setDate(new Date(2021, 3, 21), resetDateConfig),
          transactions: [transaction1, transaction4],
        },
        {
          date: setDate(new Date(2021, 3, 22), resetDateConfig),
          transactions: [transaction2],
        },
        {
          date: setDate(new Date(2021, 3, 24), resetDateConfig),
          transactions: [transaction3],
        },
      ]),
    );
  });

  it('should not be able to show detail user transactions by date if user not found', async () => {
    await expect(
      detailUserTransactionsByDateService.run({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
