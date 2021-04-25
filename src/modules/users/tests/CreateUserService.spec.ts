import AppError from '@shared/errors/AppError';

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import { CreateUserService } from '../services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUserService: CreateUserService;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.run({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
    expect(user.document).toEqual('00000000000');
  });

  it("should not be able to create a new user with another user's document", async () => {
    await createUserService.run({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    await expect(
      createUserService.run({
        document: '00000000000',
        name: 'Mary Ann',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
