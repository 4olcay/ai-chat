export function applyPagination<
  T extends { limit: (n: number) => any; offset: (n: number) => any },
>(query: T, limit?: number, offset?: number): Promise<Array<any>> {
  let result: any = query;

  if (limit !== undefined) {
    result = result.limit(limit);
  }

  if (offset !== undefined) {
    result = result.offset(offset);
  }

  return result;
}

export function withLimit<T extends { limit: (n: number) => any }>(query: T, limit?: number): any {
  return limit !== undefined ? query.limit(limit) : query;
}

export function withOffset<T extends { offset: (n: number) => any }>(
  query: T,
  offset?: number
): any {
  return offset !== undefined ? query.offset(offset) : query;
}
