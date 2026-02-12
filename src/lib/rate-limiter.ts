// Simple in-memory rate limiter
// For production, consider using Redis or external service like Upstash

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore: Map<string, RateLimitEntry> = new Map();

export function createRateLimiter(windowMs: number = 60000, maxRequests: number = 5) {
  return (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  };
}

// Default rate limiters
export const postRateLimiter = createRateLimiter(
  10 * 60 * 1000, // 10 minutes
  5 // 5 posts per 10 minutes
);

export const commentRateLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10 // 10 comments per 5 minutes
);

export const loveRateLimiter = createRateLimiter(
  1000, // 1 second
  3 // 3 loves per second (debounce)
);
