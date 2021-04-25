import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DetailUserTransactionsByDateService } from '@modules/transactions/services/DetailUserTransactionsByDateService';

export class DetailUserTransactionsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const transactionSummaryByUserService = container.resolve(
      DetailUserTransactionsByDateService,
    );

    const transactions = await transactionSummaryByUserService.run({
      user_id: String(user_id),
    });

    return response.json(transactions);
  }
}
