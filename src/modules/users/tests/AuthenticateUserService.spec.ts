import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import FakeTokenProvider from '@shared/container/providers/TokenProvider/fakes/FakeTokenProvider';

import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

let fakeHashProvider: FakeHashProvider;
let fakeTokenProvider: FakeTokenProvider;

let fakeUsersRepository: FakeUsersRepository;

let authenticateUserService: AuthenticateUserService;

describe('Authenticate User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeTokenProvider = new FakeTokenProvider();

    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeTokenProvider,
    );
  });

  it('should be able to authenticate a user', async () => {
    const user = await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    const response = await authenticateUserService.run({
      document: '00000000000',
      password: '123456789',
    });

    expect(response.token).toBeTruthy();
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate a user with invalid credentials', async () => {
    await expect(
      authenticateUserService.run({
        document: '00000000000',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate a user with invalid password', async () => {
    await fakeUsersRepository.create({
      document: '00000000000',
      name: 'John Doe',
      password: '123456789',
    });

    await expect(
      authenticateUserService.run({
        document: '00000000000',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
