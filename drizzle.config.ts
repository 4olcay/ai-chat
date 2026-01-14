import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: [
    './src/infrastructure/user/persistence/schema.ts',
    './src/infrastructure/chat/persistence/schema.ts',
    './src/infrastructure/feature-flag/persistence/schema.ts',
  ],
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
