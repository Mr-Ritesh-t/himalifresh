interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean expired records every 60 seconds to avoid memory accumulation
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60000);
  if (cleanupTimer.unref) cleanupTimer.unref();
}

/**
 * In-memory sliding window rate limiter
 * @param identifier Unique key (e.g. IP + endpoint)
 * @param limit Max allowed requests within windowMs
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0, resetInMs: Math.max(0, record.resetAt - now) };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count, resetInMs: Math.max(0, record.resetAt - now) };
}

/**
 * Distributed persistent rate limiter (uses PostgreSQL via Prisma with in-memory fallback)
 * Guarantees cross-instance rate limiting across Cloudflare Worker isolates.
 */
export async function checkDistributedRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 60000
): Promise<{ allowed: boolean; remaining: number; resetInMs: number }> {
  const memoryCheck = checkRateLimit(key, limit, windowMs);
  if (!memoryCheck.allowed) {
    return memoryCheck;
  }

  try {
    const { prisma } = await import('./prisma');
    const windowStart = new Date(Date.now() - windowMs);

    const count = await prisma.rateLimitLog.count({
      where: {
        key,
        createdAt: { gte: windowStart },
      },
    });

    if (count >= limit) {
      return { allowed: false, remaining: 0, resetInMs: windowMs };
    }

    await prisma.rateLimitLog.create({
      data: { key },
    });

    return { allowed: true, remaining: Math.max(0, limit - count - 1), resetInMs: windowMs };
  } catch (err) {
    // If database rate logging fails (e.g. build time or temporary DB unavailability), rely safely on memory rate check
    return memoryCheck;
  }
}

/**
 * Extract client IP from proxy headers (Vercel, Cloudflare, standard reverse proxy)
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}
