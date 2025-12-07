import 'dotenv/config'; // Import dotenv to load environment variables
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma', // Path to your Prisma schema file
  migrations: {
    path: 'prisma/migrations', // Path to your migrations directory
  },
  datasource: {
    url: env('DATABASE_URL'), // Database URL loaded from environment variables
  },
});