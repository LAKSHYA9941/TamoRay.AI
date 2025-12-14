import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/history
 * Fetches user's generation history with pagination
 */
export async function GET(req: Request) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get query parameters
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Get user
        const user = await prisma.user.findUnique({
            where: { clerk_id: clerkId },
            select: { id: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch jobs with pagination
        const [jobs, totalCount] = await Promise.all([
            prisma.job.findMany({
                where: {
                    userId: user.id,
                    status: 'completed', // Only show completed jobs
                },
                select: {
                    id: true,
                    prompt: true,
                    stylePreset: true,
                    results: true,
                    createdAt: true,
                    completedAt: true,
                    tokensUsed: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.job.count({
                where: {
                    userId: user.id,
                    status: 'completed',
                },
            }),
        ]);

        return NextResponse.json({
            jobs,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + jobs.length < totalCount,
            },
        });
    } catch (error) {
        console.error('❌ [History API] Error:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
