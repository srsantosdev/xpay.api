import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserService } from '@modules/users/services/CreateUserService';

export class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { document, name, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const createdUser = await createUserService.run({
      document,
      name,
      password,
    });

    return response.json(createdUser);
  }
}
