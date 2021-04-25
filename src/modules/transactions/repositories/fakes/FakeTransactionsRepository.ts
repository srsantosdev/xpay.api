import { v4 as uuid } from 'uuid';
import { set as setDate, isEqual } from 'date-fns';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { ITransactionsRepository } from '../ITransactionsRepository';

export class FakeTransactionsRepository implements ITransactionsRepository {
  private transactions: Transaction[] = [];

  public async create({
    description,
    category,
    amount,
    date,
    type,
    user_id,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = new Transaction();

    const resetDateConfig = {
      hours: 0,
      minutes: 0,
      seconds: 0,
      miliseconds: 0,
    };

    Object.assign(transaction, {
      id: uuid(),
      description,
      category,
      amount,
      date: setDate(date, resetDateConfig),
      type,
      user_id,
    });

    this.transactions.push(transaction);

    return transaction;
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const findTransaction = this.transactions.find(
      transaction => transaction.id === id,
    );

    return findTransaction;
  }

  public async filterByDate(date: Date): Promise<Transaction[]> {
    const findTransaction = this.transactions.filter(transaction =>
      isEqual(transaction.date, date),
    );

    return findTransaction;
  }

  public async filterByUser(user_id: string): Promise<Transaction[]> {
    const findTransaction = this.transactions.filter(
      transaction => transaction.user_id === user_id,
    );

    return findTransaction;
  }

  public async filterByDateAndUser(
    date: Date,
    user_id: string,
  ): Promise<Transaction[]> {
    const transactions = this.transactions
      .filter(transaction => transaction.user_id === user_id)
      .filter(transaction => isEqual(transaction.date, date));

    return transactions;
  }
}
