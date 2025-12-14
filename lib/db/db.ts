// app/lib/db/db.ts
import 'server-only';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is missing');

type PrismaClientType = ReturnType<typeof createPrismaClient>;

declare global {
  var prisma: PrismaClientType | undefined;
}

const createPrismaClient = () => {
  // Create a PostgreSQL connection pool
  const pool = new Pool({ connectionString: databaseUrl });

  // Create the Prisma adapter
  const adapter = new PrismaPg(pool);

  // Initialize Prisma Client with the adapter
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error']
  });

  return client;
};

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export * from '@prisma/client';