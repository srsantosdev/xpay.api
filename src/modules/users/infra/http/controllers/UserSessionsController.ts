import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService';
import { classToClass } from 'class-transformer';

export class UserSessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { document, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const user = await authenticateUserService.run({
      document,
      password,
    });

    return response.json(classToClass(user));
  }
}
