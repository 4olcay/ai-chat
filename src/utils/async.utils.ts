export function createTimeout<T>(ms: number, message: string = 'Operation timed out'): Promise<T> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string = 'Operation timed out'
): Promise<T> {
  return Promise.race([promise, createTimeout<T>(timeoutMs, timeoutMessage)]);
}

export interface RetryConfig {
  readonly maxAttempts: number;
  readonly delayMs: number;
  readonly backoffMultiplier?: number;
  readonly maxDelayMs?: number;
}

export async function withRetry<T>(fn: () => Promise<T>, config: RetryConfig): Promise<T> {
  let lastError: Error | null = null;
  let delayMs = config.delayMs;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < config.maxAttempts) {
        await sleep(delayMs);

        if (config.backoffMultiplier) {
          delayMs = Math.min(delayMs * config.backoffMultiplier, config.maxDelayMs ?? delayMs * 10);
        }
      }
    }
  }

  throw lastError ?? new Error('Operation failed after retries');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isAsyncGenerator<T>(value: unknown): value is AsyncGenerator<T> {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as AsyncGenerator<T>)[Symbol.asyncIterator] === 'function'
  );
}
