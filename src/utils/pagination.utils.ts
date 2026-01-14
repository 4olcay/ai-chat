export interface PaginationParams {
  readonly offset: number;
  readonly limit: number;
}

export interface PaginationResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly offset: number;
  readonly limit: number;
  readonly hasMore: boolean;
}

export const PAGINATION_CONFIG = {
  DEFAULT_LIMIT: 10,
  MIN_LIMIT: 1,
  MAX_LIMIT: 100,
  DEFAULT_OFFSET: 0,
  MIN_OFFSET: 0,
} as const;

export function validatePaginationParams(
  offset?: number | string,
  limit?: number | string
): PaginationParams {
  const parsedOffset =
    typeof offset === 'string'
      ? parseInt(offset, 10)
      : (offset ?? PAGINATION_CONFIG.DEFAULT_OFFSET);
  const parsedLimit =
    typeof limit === 'string' ? parseInt(limit, 10) : (limit ?? PAGINATION_CONFIG.DEFAULT_LIMIT);

  if (!Number.isFinite(parsedOffset) || parsedOffset < PAGINATION_CONFIG.MIN_OFFSET) {
    throw new Error(`Invalid offset: ${parsedOffset}. Must be >= ${PAGINATION_CONFIG.MIN_OFFSET}`);
  }

  if (
    !Number.isFinite(parsedLimit) ||
    parsedLimit < PAGINATION_CONFIG.MIN_LIMIT ||
    parsedLimit > PAGINATION_CONFIG.MAX_LIMIT
  ) {
    throw new Error(
      `Invalid limit: ${parsedLimit}. Must be between ${PAGINATION_CONFIG.MIN_LIMIT} and ${PAGINATION_CONFIG.MAX_LIMIT}`
    );
  }

  return {
    offset: parsedOffset,
    limit: parsedLimit,
  };
}

export function buildPaginationResult<T>(
  items: T[],
  total: number,
  offset: number,
  limit: number
): PaginationResult<T> {
  return {
    items,
    total,
    offset,
    limit,
    hasMore: offset + limit < total,
  };
}
