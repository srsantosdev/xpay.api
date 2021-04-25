import { getRepository } from 'typeorm';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { User } from '../entities/User';

export class UsersRepository implements IUsersRepository {
  constructor(private ormRepository = getRepository(User)) {}

  public async create({
    document,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      document,
      name,
      password,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { document },
    });

    return user;
  }
}
