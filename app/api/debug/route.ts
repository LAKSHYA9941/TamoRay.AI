import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jobQueue, jobStatus } from '@/lib/queue/redis';

/**
 * Debug endpoint to test all services
 * GET /api/debug
 */
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    services: {},
    errors: []
  };

  // Test 1: Database Connection
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }
    
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    await prisma.$queryRaw`SELECT 1`;
    results.services.database = { status: 'connected', message: '✅ PostgreSQL connected' };
  } catch (error) {
    results.services.database = { 
      status: 'error', 
      message: '❌ Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.errors.push('database');
  }

  // Test 2: Redis Connection
  try {
    if (!process.env.REDIS_HOST || !process.env.REDIS_PASSWORD) {
      throw new Error('Redis environment variables not set');
    }
    
    await jobStatus.set('test-connection', {
      status: 'queued',
      progress: 0,
      currentStep: 'Testing',
      eta: 0
    });
    const testStatus = await jobStatus.get('test-connection');
    if (testStatus && testStatus.status === 'queued') {
      results.services.redis = { status: 'connected', message: '✅ Redis connected' };
    } else {
      throw new Error('Redis read/write test failed');
    }
  } catch (error) {
    results.services.redis = { 
      status: 'error', 
      message: '❌ Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.errors.push('redis');
  }

  // Test 3: Cloudinary Configuration
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    
    if (cloudName && apiKey && apiSecret) {
      results.services.cloudinary = { 
        status: 'configured', 
        message: '✅ Cloudinary configured',
        cloudName: cloudName
      };
    } else {
      throw new Error('Missing Cloudinary credentials');
    }
  } catch (error) {
    results.services.cloudinary = { 
      status: 'error', 
      message: '❌ Cloudinary not configured',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.errors.push('cloudinary');
  }

  // Test 4: Replicate API Token
  try {
    const token = process.env.REPLICATE_API_TOKEN;
    if (token && token.startsWith('r8_')) {
      results.services.replicate = { 
        status: 'configured', 
        message: '✅ Replicate API token configured'
      };
    } else {
      throw new Error('Invalid or missing Replicate API token');
    }
  } catch (error) {
    results.services.replicate = { 
      status: 'error', 
      message: '❌ Replicate not configured',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
    results.errors.push('replicate');
  }

  // Test 5: Check Queue (only if database is working)
  if (!results.errors.includes('database')) {
    try {
      const queueLength = await prisma.job.count({
        where: { status: 'queued' }
      });
      results.services.queue = {
        status: 'ok',
        message: `✅ Queue accessible`,
        pendingJobs: queueLength
      };
    } catch (error) {
      results.services.queue = {
        status: 'error',
        message: '❌ Queue check failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  } else {
    results.services.queue = {
      status: 'skipped',
      message: '⏭️ Skipped (database not available)'
    };
  }

  // Test 6: Environment Variables Summary
  const requiredVars = [
    'DATABASE_URL',
    'REDIS_HOST',
    'REDIS_PASSWORD',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'REPLICATE_API_TOKEN',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'OPENAI_API_KEY'
  ];

  const envStatus = requiredVars.map(varName => ({
    name: varName,
    set: !!process.env[varName]
  }));

  const missingVars = envStatus.filter(v => !v.set).map(v => v.name);
  
  results.environment = {
    total: requiredVars.length,
    configured: requiredVars.length - missingVars.length,
    missing: missingVars
  };

  if (missingVars.length > 0) {
    results.errors.push('environment');
  }

  const allHealthy = results.errors.length === 0;
  
  return NextResponse.json(
    {
      healthy: allHealthy,
      ...results,
      instructions: allHealthy 
        ? '🎉 All systems ready! You can start generating thumbnails.'
        : '⚠️ Please fix the errors above. See SETUP.md for help.'
    },
    { status: allHealthy ? 200 : 503 }
  );
}
