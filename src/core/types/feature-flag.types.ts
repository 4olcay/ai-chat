export enum FeatureFlagType {
  BOOLEAN = 'boolean',
  NUMBER = 'number',
  STRING = 'string',
}

export interface FeatureFlagValue {
  STREAMING_ENABLED: boolean;
  PAGINATION_LIMIT: number;
  CHAT_HISTORY_ENABLED: boolean;
  AI_TOOLS_ENABLED: boolean;
}
