import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { jobQueue, jobStatus } from '@/lib/queue/redis';

// Request validation schema
const refineSchema = z.object({
  parentJobId: z.string().uuid(),
  selectedVariation: z.number().min(0).max(2),
  refinementPrompt: z.string().min(10).max(2000, 'Refinement prompt too long (max 2000 characters)'),
  style: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate input
    const body = await req.json();
    const validated = refineSchema.parse(body);

    // 3. Get user and parent job
    const user = await prisma.user.findUnique({
      where: { clerk_id: clerkId },
      select: { id: true, tokens: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.tokens < 1) {
      return NextResponse.json(
        {
          error: 'Insufficient tokens',
          tokensNeeded: 1,
          tokensAvailable: user.tokens,
        },
        { status: 402 }
      );
    }

    // 4. Get parent job and selected image
    const parentJob = await prisma.job.findFirst({
      where: {
        id: validated.parentJobId,
        userId: user.id,
      },
    });

    if (!parentJob || !parentJob.results) {
      return NextResponse.json({ error: 'Parent job not found or incomplete' }, { status: 404 });
    }

    const results = parentJob.results as any[];
    const selectedImage = results[validated.selectedVariation];

    if (!selectedImage) {
      return NextResponse.json({ error: 'Selected variation not found' }, { status: 404 });
    }

    // 5. Create refinement job and deduct token
    const job = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Deduct token
      await tx.user.update({
        where: {
          id: user.id,
          tokens: { gte: 1 },
        },
        data: {
          tokens: { decrement: 1 },
        },
      });

      // Update parent job with selected variation
      await tx.job.update({
        where: { id: validated.parentJobId },
        data: { selectedVariation: validated.selectedVariation },
      });

      // Create refinement job
      return tx.job.create({
        data: {
          userId: user.id,
          prompt: validated.refinementPrompt,
          stylePreset: validated.style,
          parentJobId: validated.parentJobId,
          status: 'queued',
          progress: 0,
          tokensUsed: 1,
        },
      });
    });

    // 6. Add to Redis queue
    await jobQueue.push({
      jobId: job.id,
      userId: user.id,
      prompt: validated.refinementPrompt,
      stylePreset: validated.style,
      parentJobId: validated.parentJobId,
      baseImageUrl: selectedImage.url,
      queuedAt: new Date().toISOString(),
    });

    // 7. Set initial status
    await jobStatus.set(job.id, {
      status: 'queued',
      progress: 0,
      currentStep: 'Waiting in queue...',
      eta: 30,
    });

    return NextResponse.json(
      {
        jobId: job.id,
        status: 'queued',
        estimatedTime: 30,
      },
      { status: 202 }
    );
  } catch (error) {
    console.error('Refine API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
