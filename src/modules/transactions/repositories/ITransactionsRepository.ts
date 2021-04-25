import { ICreateTransactionDTO } from '../dtos/ICreateTransactionDTO';
import { Transaction } from '../infra/typeorm/entities/Transaction';

export interface ITransactionsRepository {
  create(data: ICreateTransactionDTO): Promise<Transaction>;
  findById(id: string): Promise<Transaction | undefined>;
  filterByUser(user_id: string): Promise<Transaction[]>;
  filterByDate(date: Date): Promise<Transaction[]>;
  filterByDateAndUser(date: Date, user_id: string): Promise<Transaction[]>;
}
