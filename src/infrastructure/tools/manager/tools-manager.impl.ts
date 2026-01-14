import { injectable } from 'tsyringe';
import logger from '@/infrastructure/shared/logging/logger';
import type { IAITool, IAIToolsManager, ToolStreamEvent } from '@/domain/tools';
import type { ToolName } from '@/core/constants';

@injectable()
export class ToolsManager implements IAIToolsManager {
  private tools = new Map<ToolName, IAITool>();
  private resultCache = new Map<ToolName, Record<string, unknown>>();

  registerTool(tool: IAITool): void {
    this.tools.set(tool.name, tool);
    logger.info(`Tool registered: ${tool.name}`);
  }

  async executeTool(toolName: ToolName): Promise<Record<string, unknown> | null> {
    if (this.resultCache.has(toolName)) {
      const cachedResult = this.resultCache.get(toolName);
      logger.debug(`Using cached result for tool: ${toolName}`);
      return cachedResult || null;
    }

    const tool = this.tools.get(toolName);
    if (!tool) {
      logger.warn(`Tool not found: ${toolName}`);
      return null;
    }

    try {
      const result = await tool.execute();
      this.resultCache.set(toolName, result);
      return result;
    } catch (error) {
      logger.error(`Failed to execute tool ${toolName}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  async *executeAllTools(): AsyncGenerator<ToolStreamEvent> {
    logger.debug(
      `Executing all tools. Available tools: ${Array.from(this.tools.keys()).join(', ')}`
    );

    for (const [name] of this.tools.entries()) {
      try {
        yield { event: 'tool_start', data: { name } };
        const result = await this.executeTool(name);
        yield {
          event: 'tool_end',
          data: { name, result: result || { error: 'Tool returned null' } },
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to execute tool ${name}`, { error: errorMessage });
        yield { event: 'tool_error', data: { name, error: errorMessage } };
      }
    }
  }

  getAvailableTools(): ToolName[] {
    return Array.from(this.tools.keys());
  }

  clearCache(): void {
    this.resultCache.clear();
    logger.debug('Tool result cache cleared');
  }
}
