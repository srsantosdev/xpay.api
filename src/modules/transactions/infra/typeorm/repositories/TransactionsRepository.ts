import { getRepository } from 'typeorm';

import { Transaction } from '@modules/transactions/infra/typeorm/entities/Transaction';
import { ICreateTransactionDTO } from '@modules/transactions/dtos/ICreateTransactionDTO';
import { ITransactionsRepository } from '@modules/transactions/repositories/ITransactionsRepository';

export class TransactionsRepository implements ITransactionsRepository {
  constructor(private ormRepository = getRepository(Transaction)) {}

  public async create({
    description,
    category,
    amount,
    date,
    type,
    user_id,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      description,
      category,
      amount,
      date,
      type,
      user_id,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async findById(id: string): Promise<Transaction | undefined> {
    const transaction = this.ormRepository.findOne({
      where: { id },
    });

    return transaction;
  }

  public async filterByUser(user_id: string): Promise<Transaction[]> {
    const transactions = this.ormRepository.find({
      where: { user_id },
    });

    return transactions;
  }

  public async filterByDateAndUser(
    date: Date,
    user_id: string,
  ): Promise<Transaction[]> {
    const transactions = this.ormRepository.find({
      where: { user_id, date },
    });

    return transactions;
  }
}
