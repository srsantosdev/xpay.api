interface PayloadToken {
  [key: string]: any;
}

export interface ParametersTokenProvider {
  payload: PayloadToken;
  secret?: string;
  options?: any;
}

export default interface ITokenProvider {
  generateToken(data: ParametersTokenProvider): string;
}
