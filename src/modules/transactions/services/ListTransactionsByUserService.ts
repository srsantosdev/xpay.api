import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

type IRequest = {
  user_id: string;
};

@injectable()
export class ListTransactionsByUserService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async run({ user_id }: IRequest): Promise<Transaction[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const transactions = await this.transactionsRepository.filterByUser(
      user_id,
    );

    return transactions;
  }
}
