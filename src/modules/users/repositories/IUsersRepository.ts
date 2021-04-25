import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../infra/typeorm/entities/User';

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByDocument(document: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
}
