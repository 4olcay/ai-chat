import { injectable, container } from 'tsyringe';
import { CompletionStrategy } from './completion.strategy';
import type { ICompletionStrategy } from './completion-strategy.interface';

@injectable()
export class CompletionStrategyFactory {
  create(): ICompletionStrategy {
    return container.resolve(CompletionStrategy);
  }
}
