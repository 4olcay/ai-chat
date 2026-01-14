export const getCacheKey = {
  featureFlags: {
    all: (): string => 'feature_flags:all',
    byName: (name: string): string => `feature_flags:${name}`,
  },
  chat: {
    history: (chatId: string, limit: number, offset: number): string =>
      `chat:${chatId}:history:limit:${limit}:offset:${offset}`,
    byId: (chatId: string): string => `chat:${chatId}`,
    listByUser: (userId: string, limit: number, offset: number): string =>
      `chats:user:${userId}:limit:${limit}:offset:${offset}`,
  },
  user: {
    byId: (userId: string): string => `user:${userId}`,
    byEmail: (email: string): string => `user:email:${email}`,
  },
} as const;

export const CACHE_TTL = {
  FEATURE_FLAGS: 5 * 60, // 5 minutes
  CHAT_HISTORY: 1 * 60, // 1 minute
  USER_DATA: 10 * 60, // 10 minutes
  CHAT_LIST: 2 * 60, // 2 minutes
} as const;

export const CACHE_INVALIDATION = {
  featureFlagUpdated: (name: string): string[] => [
    getCacheKey.featureFlags.all(),
    getCacheKey.featureFlags.byName(name),
  ],
  chatUpdated: (chatId: string): string[] => [
    getCacheKey.chat.byId(chatId),
    `chat:${chatId}:history:*`,
  ],
  chatMessageAdded: (chatId: string): string[] => [`chat:${chatId}:history:*`],
  userUpdated: (userId: string): string[] => [
    getCacheKey.user.byId(userId),
    `chats:user:${userId}:*`,
  ],
} as const;
