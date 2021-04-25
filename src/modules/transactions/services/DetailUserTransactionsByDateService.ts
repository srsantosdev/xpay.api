import { inject, injectable } from 'tsyringe';
import { set as setDate, isEqual } from 'date-fns';

import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Transaction } from '../infra/typeorm/entities/Transaction';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

type IRequest = {
  user_id: string;
};

type TransactionByDate = {
  date: Date;
  transactions: Transaction[];
};

@injectable()
export class DetailUserTransactionsByDateService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async run({ user_id }: IRequest): Promise<TransactionByDate[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const transactions = await this.transactionsRepository.filterByUser(
      user_id,
    );

    const resetDateConfig = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    };

    const dates = transactions.map(transaction => transaction.date);
    const nonDuplicateDates: Date[] = [];

    dates.forEach(date => {
      const findDate = nonDuplicateDates.find(dateInArray =>
        isEqual(dateInArray, setDate(date, resetDateConfig)),
      );

      if (!findDate) {
        nonDuplicateDates.push(setDate(date, resetDateConfig));
      }
    });

    const transactionsByDate: TransactionByDate[] = [];

    await Promise.all(
      nonDuplicateDates.map(async date => {
        const transactionsOnDate = await this.transactionsRepository.filterByDateAndUser(
          date,
          user.id,
        );

        const transactionByDate: TransactionByDate = {
          date,
          transactions: transactionsOnDate,
        };

        transactionsByDate.push(transactionByDate);

        return transactionByDate;
      }),
    );

    return transactionsByDate;
  }
}
