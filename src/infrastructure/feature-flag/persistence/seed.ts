import { DatabaseConnection } from '@/infrastructure/shared/database/connection';
import { featureFlagsTable } from './schema';
import { FEATURE_FLAGS } from '@/core/constants';

const DEFAULT_FLAGS = [
  {
    name: FEATURE_FLAGS.STREAMING_ENABLED,
    type: 'boolean',
    value: 'false',
    description: 'Enable streaming responses for chat completions',
  },
  {
    name: FEATURE_FLAGS.PAGINATION_LIMIT,
    type: 'number',
    value: '20',
    description: 'Default pagination limit for list endpoints (min: 10, max: 100)',
  },
  {
    name: FEATURE_FLAGS.CHAT_HISTORY_ENABLED,
    type: 'boolean',
    value: 'true',
    description: 'Enable chat history retrieval',
  },
  {
    name: FEATURE_FLAGS.AI_TOOLS_ENABLED,
    type: 'boolean',
    value: 'true',
    description: 'Enable AI tools integration',
  },
];

export async function seedFeatureFlags(): Promise<void> {
  const db = DatabaseConnection.getInstance();

  for (const flag of DEFAULT_FLAGS) {
    await db
      .insert(featureFlagsTable)
      .values({
        name: flag.name,
        type: flag.type,
        value: flag.value,
        description: flag.description,
      })
      .onConflictDoNothing();
  }
}
