import { ToolName } from '@/core/constants';

export abstract class AbstractTool {
  abstract readonly name: ToolName;
  abstract readonly description: string;

  abstract execute(): Promise<Record<string, unknown>>;
}
