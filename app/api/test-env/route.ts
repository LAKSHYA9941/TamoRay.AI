import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
      hasUpstashToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasClerkPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
      nodeEnv: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      environment: envCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Environment check failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
