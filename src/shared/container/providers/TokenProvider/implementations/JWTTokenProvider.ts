import * as jwt from 'jsonwebtoken';
import authConfig from '@config/auth';

import ITokenProvider, {
  ParametersTokenProvider,
} from '../models/ITokenProvider';

export default class JWTTokenProvider implements ITokenProvider {
  public generateToken({
    payload,
    secret,
    options,
  }: ParametersTokenProvider): string {
    const { expiresIn, secrets } = authConfig.jwt;

    const token = jwt.sign(payload, secret || secrets.appSecret, {
      expiresIn,
      ...options,
    });

    return token;
  }
}
