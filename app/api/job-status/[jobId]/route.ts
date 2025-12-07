import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { jobStatus } from '@/lib/queue/redis';

export async function GET(
  req: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = params.jobId;

    // Check Redis first (fast)
    const redisStatus = await jobStatus.get(jobId);

    if (redisStatus && Object.keys(redisStatus).length > 0) {
      return NextResponse.json({
        jobId,
        status: redisStatus.status,
        progress: parseInt(redisStatus.progress as string) || 0,
        currentStep: redisStatus.currentStep,
        eta: parseInt(redisStatus.eta as string) || 0,
        results: redisStatus.results ? JSON.parse(redisStatus.results as string) : null,
        error: redisStatus.error,
      });
    }

    // Fallback to database
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        user: { clerk_id: clerkId },
      },
      select: {
        id: true,
        status: true,
        progress: true,
        currentStep: true,
        eta: true,
        results: true,
        errorMessage: true,
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      jobId: job.id,
      status: job.status,
      progress: job.progress,
      currentStep: job.currentStep,
      eta: job.eta,
      results: job.results,
      error: job.errorMessage,
    });
  } catch (error) {
    console.error('Job status error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
