import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { TransactionSummaryByUserService } from '@modules/transactions/services/TransactionSummaryByUserService';

export class TransactionsSummaryController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const transactionSummaryByUserService = container.resolve(
      TransactionSummaryByUserService,
    );

    const transactions = await transactionSummaryByUserService.run({
      user_id: String(user_id),
    });

    return response.json(transactions);
  }
}
