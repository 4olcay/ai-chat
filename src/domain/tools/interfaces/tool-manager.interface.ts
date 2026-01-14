import type { IAITool } from './tool.interface';
import type { ToolName } from '@/core/constants';

export type ToolStreamEvent =
  | { event: 'tool_start'; data: { name: ToolName } }
  | { event: 'tool_end'; data: { name: ToolName; result: unknown } }
  | { event: 'tool_error'; data: { name: ToolName; error: string } };

export interface IAIToolsManager {
  registerTool(tool: IAITool): void;
  executeTool(toolName: ToolName): Promise<Record<string, unknown> | null>;
  executeAllTools(): AsyncGenerator<ToolStreamEvent>;
  getAvailableTools(): ToolName[];
  clearCache(): void;
}
