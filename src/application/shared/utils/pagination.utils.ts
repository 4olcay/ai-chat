const PAGINATION_CONSTRAINTS = {
  MIN_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_LIMIT: 10,
  DEFAULT_OFFSET: 0,
};

export function constrainLimit(
  limit: number,
  min = PAGINATION_CONSTRAINTS.MIN_LIMIT,
  max = PAGINATION_CONSTRAINTS.MAX_LIMIT
): number {
  return Math.min(Math.max(limit, min), max);
}

export function constrainOffset(offset: number): number {
  return Math.max(offset, 0);
}

export function parseLimitParam(
  queryLimit?: string | string[],
  defaultLimit = PAGINATION_CONSTRAINTS.DEFAULT_LIMIT
): number {
  const limitValue = Array.isArray(queryLimit) ? queryLimit[0] : queryLimit;
  const parsed = parseInt(limitValue || '', 10);
  const limit = isNaN(parsed) ? defaultLimit : parsed;
  return constrainLimit(limit);
}

export function parseOffsetParam(
  queryOffset?: string | string[],
  defaultOffset = PAGINATION_CONSTRAINTS.DEFAULT_OFFSET
): number {
  const offsetValue = Array.isArray(queryOffset) ? queryOffset[0] : queryOffset;
  const parsed = parseInt(offsetValue || '', 10);
  const offset = isNaN(parsed) ? defaultOffset : parsed;
  return constrainOffset(offset);
}

export function validateFlagAsLimit(flagValue: string | number): number {
  const parsed = typeof flagValue === 'string' ? parseInt(flagValue, 10) : flagValue;
  return constrainLimit(isNaN(parsed) ? PAGINATION_CONSTRAINTS.DEFAULT_LIMIT : parsed);
}

export function getPaginationConstraints() {
  return { ...PAGINATION_CONSTRAINTS };
}
