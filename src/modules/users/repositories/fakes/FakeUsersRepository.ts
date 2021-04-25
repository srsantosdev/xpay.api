import { v4 as uuid } from 'uuid';

import { ICreateUserDTO } from '@modules/users/dtos/ICreateUserDTO';
import { User } from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create({
    document,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid(), document, name, password });

    this.users.push(user);

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === id);

    return user;
  }

  public async findByDocument(document: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.document === document);

    return user;
  }
}
