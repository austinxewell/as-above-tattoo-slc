type RateLimitOptions = { windowMs: number; max: number };

export function createRateLimiter({ windowMs, max }: RateLimitOptions) {
  const attempts = new Map<string, number[]>();

  return function isRateLimited(key: string) {
    const now = Date.now();
    const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);

    if (recent.length >= max) {
      attempts.set(key, recent);
      return true;
    }

    recent.push(now);
    attempts.set(key, recent);
    return false;
  };
}
