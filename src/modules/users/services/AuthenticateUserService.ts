import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/auth';

import { User } from '@modules/users/infra/typeorm/entities/User';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '@shared/container/providers/HashProvider/models/IHashProvider';
import ITokenProvider from '@shared/container/providers/TokenProvider/models/ITokenProvider';

type IRequest = {
  document: string;
  password: string;
};

type IResponse = {
  user: User;
  token: string;
};

@injectable()
export class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('TokenProvider')
    private tokenProvider: ITokenProvider,
  ) {}

  public async run({ document, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByDocument(document);

    if (!user) {
      throw new AppError('Incorrect credentials combination.', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect credentials combination.', 401);
    }

    const token = this.tokenProvider.generateToken({
      payload: { sub: user.id },
      secret: authConfig.jwt.secrets.appSecret,
    });

    return { user, token };
  }
}
