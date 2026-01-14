import { pgTable, text, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const featureFlagsTable = pgTable('feature_flags', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 100 }).notNull().unique(),
  type: varchar('type', { length: 50 }).notNull(),
  value: text('value').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export type FeatureFlag = typeof featureFlagsTable.$inferSelect;
