import { NextResponse } from 'next/server';
import { jobQueue } from '@/lib/queue/redis';
import { processGenerationJob, processRefinementJob } from '@/lib/queue/job-processor';

/**
 * Worker endpoint - processes jobs from the queue
 * Can be triggered by Vercel Cron or manually
 */
export async function GET() {
  console.log('⚙️ [Worker] Starting job processing cycle');

  let processedCount = 0;
  const maxBatchSize = 3; // Process up to 3 jobs per cycle

  try {
    while (processedCount < maxBatchSize) {
      // Get next job from queue
      const job = await jobQueue.pop();

      if (!job) {
        console.log('📭 [Worker] Queue is empty');
        break;
      }

      console.log(`🔄 [Worker] Processing job ${job.jobId}`);

      try {
        // Determine job type and process accordingly
        if (job.parentJobId) {
          // This is a refinement job
          await processRefinementJob(job);
        } else {
          // This is a generation job
          await processGenerationJob(job);
        }

        processedCount++;
        console.log(`✅ [Worker] Job ${job.jobId} processed successfully`);
      } catch (error) {
        console.error(`❌ [Worker] Job ${job.jobId} failed:`, error);
        // Job processor handles error updates, so we just log here
      }
    }

    console.log(`🏁 [Worker] Cycle complete. Processed ${processedCount} jobs`);

    return NextResponse.json({
      success: true,
      processed: processedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ [Worker] Worker cycle failed:', error);
    return NextResponse.json(
      {
        error: 'Worker cycle failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
