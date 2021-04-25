import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

type IRequest = {
  description: string;
  type: 'income' | 'outcome';
  category: string;
  amount: number;
  date: Date;
  user_id: string;
};

@injectable()
export class CreateTransactionService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async run({
    description,
    category,
    amount,
    date,
    type,
    user_id,
  }: IRequest): Promise<Transaction> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const transaction = await this.transactionsRepository.create({
      description,
      category,
      amount,
      date,
      type,
      user_id,
    });

    return transaction;
  }
}
