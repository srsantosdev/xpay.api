import { inject, injectable } from 'tsyringe';
import { set as setDate, isEqual } from 'date-fns';

import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { ITransactionsRepository } from '../repositories/ITransactionsRepository';

type IRequest = {
  user_id: string;
};

type TransactionSummary = {
  date: Date;
  total: number;
};

@injectable()
export class TransactionSummaryByUserService {
  constructor(
    @inject('TransactionsRepository')
    private transactionsRepository: ITransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async run({ user_id }: IRequest): Promise<TransactionSummary[]> {
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

    const transactionsSummary: TransactionSummary[] = [];

    await Promise.all(
      nonDuplicateDates.map(async date => {
        const transactionsOnDate = await this.transactionsRepository.filterByDateAndUser(
          date,
          user.id,
        );

        const totalTransactions = transactionsOnDate.reduce(
          (accumulator, transaction) => {
            if (transaction.type === 'income') {
              return accumulator + transaction.amount;
            }

            return accumulator - transaction.amount;
          },
          0,
        );

        const transactionSummary: TransactionSummary = {
          date,
          total: totalTransactions,
        };

        transactionsSummary.push(transactionSummary);

        return transactionSummary;
      }),
    );

    return transactionsSummary;
  }
}
