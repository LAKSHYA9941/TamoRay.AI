import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { jobQueue, jobStatus } from '@/lib/queue/redis';

// Request validation schema
const generateSchema = z.object({
    prompt: z.string().min(10, 'Prompt must be at least 10 characters').max(500, 'Prompt too long'),
    uploadedImages: z.array(z.string().url()).max(3).optional(),
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
        const validated = generateSchema.parse(body);

        // 3. Get user and check tokens
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

        // 4. Create job and deduct token atomically
        const job = await prisma.$transaction(async (tx) => {
            // Deduct token
            await tx.user.update({
                where: {
                    id: user.id,
                    tokens: { gte: 1 }, // Ensure token is still available
                },
                data: {
                    tokens: { decrement: 1 },
                },
            });

            // Create job
            return tx.job.create({
                data: {
                    userId: user.id,
                    prompt: validated.prompt,
                    uploadedImages: validated.uploadedImages || [],
                    stylePreset: validated.style,
                    status: 'queued',
                    progress: 0,
                    tokensUsed: 1,
                },
            });
        });

        // 5. Add to Redis queue
        await jobQueue.push({
            jobId: job.id,
            userId: user.id,
            prompt: validated.prompt,
            uploadedImages: validated.uploadedImages,
            stylePreset: validated.style,
            queuedAt: new Date().toISOString(),
        });

        // 6. Set initial status in Redis
        await jobStatus.set(job.id, {
            status: 'queued',
            progress: 0,
            currentStep: 'Waiting in queue...',
            eta: 45,
        });

        return NextResponse.json(
            {
                jobId: job.id,
                status: 'queued',
                estimatedTime: 45,
            },
            { status: 202 }
        );
    } catch (error) {
        console.error('Generate API error:', error);

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
