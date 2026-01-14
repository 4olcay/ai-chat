import { ParameterType } from '../decorators/parameter.decorators';
import {
  IParameterStrategy,
  BodyParameterStrategy,
  QueryParameterStrategy,
  ParamsParameterStrategy,
  UserParameterStrategy,
  RequestParameterStrategy,
  ReplyParameterStrategy,
  ClientParameterStrategy,
  PaginationParameterStrategy,
} from './parameter.strategy';

export class ParameterStrategyFactory {
  private static strategies: Map<ParameterType, IParameterStrategy> = new Map([
    [ParameterType.BODY, new BodyParameterStrategy()],
    [ParameterType.QUERY, new QueryParameterStrategy()],
    [ParameterType.PARAMS, new ParamsParameterStrategy()],
    [ParameterType.USER, new UserParameterStrategy()],
    [ParameterType.REQUEST, new RequestParameterStrategy()],
    [ParameterType.REPLY, new ReplyParameterStrategy()],
    [ParameterType.CLIENT, new ClientParameterStrategy()],
    [ParameterType.PAGINATION, new PaginationParameterStrategy()],
  ]);

  static getStrategy(type: ParameterType): IParameterStrategy {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`No strategy found for parameter type: ${type}`);
    }
    return strategy;
  }
}
