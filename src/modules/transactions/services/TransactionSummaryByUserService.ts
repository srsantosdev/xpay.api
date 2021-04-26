import { inject, injectable } from 'tsyringe';
import { set as setDate, isEqual, isAfter, isBefore } from 'date-fns';

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

    const dates = transactions
      .map(transaction => transaction.date)
      .sort((a: any, b: any) => {
        if (a > b) {
          return 1;
        }

        if (a < b) {
          return -1;
        }

        return 0;
      });
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
    const calculatedValues: number[] = [];

    await Promise.all(
      nonDuplicateDates.map(async date => {
        const transactionsOnDate = await this.transactionsRepository.filterByDateAndUser(
          date,
          user.id,
        );

        const totalTransactionsOnDate = transactionsOnDate.reduce(
          (accumulator, transaction) => {
            if (transaction.type === 'income') {
              return accumulator + Number(transaction.amount);
            }

            return accumulator - Number(transaction.amount);
          },
          0,
        );

        calculatedValues.push(totalTransactionsOnDate);

        const totalTransactions = calculatedValues.reduce(
          (accumulator, total) => {
            return accumulator + total;
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

    const sortTransactionsSummary = transactionsSummary.sort((a, b) => {
      if (isBefore(a.date, b.date)) {
        return -1;
      }

      if (isAfter(a.date, b.date)) {
        return 1;
      }

      return 0;
    });

    return sortTransactionsSummary;
  }
}
