import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import { FakeTransactionsRepository } from '../repositories/fakes/FakeTransactionsRepository';
import { CreateTransactionService } from '../services/CreateTransactionService';

let fakeTransactionsRepository: FakeTransactionsRepository;
let fakeUsersRepository: FakeUsersRepository;

let createTransactionService: CreateTransactionService;

describe('Create Transaction', () => {
  beforeEach(() => {
    fakeTransactionsRepository = new FakeTransactionsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createTransactionService = new CreateTransactionService(
      fakeTransactionsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new transaction', async () => {
    const user = await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    const transaction = await createTransactionService.run({
      amount: 300,
      category: 'Compras',
      date: new Date(),
      description: 'Supermercado',
      type: 'outcome',
      user_id: user.id,
    });

    expect(transaction).toHaveProperty('id');
    expect(transaction.description).toBe('Supermercado');
    expect(transaction.amount).toBe(300);
  });

  it('should not be able to create a new transaction if user not found', async () => {
    await expect(
      createTransactionService.run({
        amount: 300,
        category: 'Compras',
        date: new Date(),
        description: 'Supermercado',
        type: 'outcome',
        user_id: 'non-existing',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
