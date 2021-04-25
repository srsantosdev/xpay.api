import { set as setDate } from 'date-fns';
import AppError from '@shared/errors/AppError';

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { TransactionSummaryByUserService } from '../services/TransactionSummaryByUserService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeUsersRepository: FakeUsersRepository;

let transactionSummaryByUserService: TransactionSummaryByUserService;

describe('Transaction Summary By User', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    transactionSummaryByUserService = new TransactionSummaryByUserService(
      fakeTransactionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to show transactions summary by user', async () => {
    const user = await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    await fakeTransactionsRepository.create({
      amount: 300,
      category: 'Compras',
      date: new Date(2021, 3, 21),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    await fakeTransactionsRepository.create({
      amount: 897,
      category: 'Prestação de serviços',
      date: new Date(2021, 3, 21),
      description: 'Empresa Y',
      type: 'income',
      user_id: user.id,
    });

    await fakeTransactionsRepository.create({
      amount: 1000,
      category: 'Freelancer',
      date: new Date(2021, 3, 22),
      description: 'Desenvolvimento de app',
      type: 'income',
      user_id: user.id,
    });

    await fakeTransactionsRepository.create({
      amount: 300,
      category: 'Prestação de serviços',
      date: new Date(2021, 3, 22),
      description: 'Empresa X',
      type: 'income',
      user_id: user.id,
    });

    const transactionsSummary = await transactionSummaryByUserService.run({
      user_id: user.id,
    });

    const resetDateConfig = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    };

    expect(transactionsSummary).toEqual(
      expect.arrayContaining([
        {
          date: setDate(new Date(2021, 3, 21), resetDateConfig),
          total: 597,
        },
        {
          date: setDate(new Date(2021, 3, 22), resetDateConfig),
          total: 1300,
        },
      ]),
    );
  });

  it('should not be able to show transactions summary by user if user not found', async () => {
    await expect(
      transactionSummaryByUserService.run({
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
