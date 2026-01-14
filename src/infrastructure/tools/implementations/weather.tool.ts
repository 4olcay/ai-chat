import { injectable } from 'tsyringe';
import logger from '@/infrastructure/shared/logging/logger';
import { AbstractTool } from '@/domain/tools';
import { Tool } from '@/core/constants';

@injectable()
export class WeatherTool extends AbstractTool {
  readonly name = Tool.WEATHER;
  readonly description = 'Get weather information for a specific location';

  async execute(): Promise<Record<string, unknown>> {
    try {
      const result = {
        location: 'Istanbul',
        temperature: 15,
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        lastUpdated: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Failed to fetch weather data`, {
          error: error.message,
          stack: error.stack,
        });
      } else {
        logger.error(`Failed to fetch weather data`, { error: String(error) });
      }
      throw error;
    }
  }
}
