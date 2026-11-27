import { PrismaClient } from '@prisma/client';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const isBuildTime = !process.env.DATABASE_URL;
  const connectionString =
    process.env.DATABASE_URL ||
    'postgresql://build_placeholder:build_placeholder@localhost:5432/build_placeholder';

  const adapter = new PrismaNeonHTTP(connectionString, {});
  return new PrismaClient({
    adapter,
    log: isBuildTime ? [] : (process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']),
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
