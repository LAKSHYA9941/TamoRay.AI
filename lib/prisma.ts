// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

declare global {
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client with PostgreSQL adapter for Prisma 7
function createPrismaClient() {
  // Only create adapter if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set. Prisma client will not work.');
    // Return a mock client that will fail gracefully
    return null as any;
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });
}

// Prevent multiple instances of Prisma Client in development
const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;