import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { appConfig } from '../config';

let instance: ReturnType<typeof drizzle> | null = null;
let queryClient: postgres.Sql | null = null;

export class DatabaseConnection {
  static getInstance(): ReturnType<typeof drizzle> {
    if (!instance) {
      const databaseUrl = appConfig.getDatabaseUrl();
      queryClient = postgres(databaseUrl);
      instance = drizzle(queryClient, { schema });
    }

    return instance;
  }

  static async close(): Promise<void> {
    if (queryClient) {
      await queryClient.end();
      queryClient = null;
      instance = null;
    }
  }
}
