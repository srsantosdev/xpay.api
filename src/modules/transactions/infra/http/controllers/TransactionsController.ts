import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateTransactionService } from '@modules/transactions/services/CreateTransactionService';
import { ListTransactionsByUserService } from '@modules/transactions/services/ListTransactionsByUserService';

export class TransactionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { amount, category, date, type, description } = request.body;
    const { user_id } = request.query;

    const createTransactionService = container.resolve(
      CreateTransactionService,
    );

    const createdTransaction = await createTransactionService.run({
      amount,
      category,
      date,
      type,
      description,
      user_id: String(user_id),
    });

    return response.json(createdTransaction);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const listTransactionsByUserService = container.resolve(
      ListTransactionsByUserService,
    );

    const transactions = await listTransactionsByUserService.run({
      user_id: String(user_id),
    });

    return response.json(transactions);
  }
}
