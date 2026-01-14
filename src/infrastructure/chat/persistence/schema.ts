import { pgTable, varchar, timestamp, uuid, text, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { MessageRole } from '@/core/constants';
import { usersTable } from '../../user/persistence/schema';

export const chatsTable = pgTable('chats', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export type Chat = typeof chatsTable.$inferSelect;

export const messageRoleEnum = pgEnum('message_role', [
  MessageRole.USER,
  MessageRole.ASSISTANT,
  MessageRole.SYSTEM,
]);

export const messagesTable = pgTable('messages', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  chatId: uuid('chat_id')
    .notNull()
    .references(() => chatsTable.id, { onDelete: 'cascade' }),
  role: messageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at')
    .notNull()
    .default(sql`now()`),
  deletedAt: timestamp('deleted_at'),
});

export type Message = typeof messagesTable.$inferSelect;

export const chatsRelations = relations(chatsTable, ({ many }) => ({
  messages: many(messagesTable),
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  chat: one(chatsTable, {
    fields: [messagesTable.chatId],
    references: [chatsTable.id],
  }),
}));
