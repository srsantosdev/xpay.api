import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import { User } from '../infra/typeorm/entities/User';

type IRequest = {
  name: string;
  document: string;
  password: string;
};

@injectable()
export class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async run({ name, password, document }: IRequest): Promise<User> {
    const findUser = await this.usersRepository.findByDocument(document);

    if (findUser) {
      throw new AppError('User already exists.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const createdUser = await this.usersRepository.create({
      name,
      document,
      password: hashedPassword,
    });

    return createdUser;
  }
}
