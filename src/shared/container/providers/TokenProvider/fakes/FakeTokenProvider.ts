import ITokenProvider, {
  ParametersTokenProvider,
} from '../models/ITokenProvider';

export default class FakeTokenProvider implements ITokenProvider {
  public generateToken({ payload }: ParametersTokenProvider): string {
    return JSON.stringify(payload);
  }
}
