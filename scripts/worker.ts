#!/usr/bin/env tsx
/**
 * Background Worker for Processing Image Generation Jobs
 * 
 * This worker continuously polls the Redis queue for new jobs
 * and processes them using the Replicate API.
 * 
 * Run with: npm run worker
 * Or: tsx scripts/worker.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { jobQueue } from '@/lib/queue/redis';
import { processGenerationJob } from '@/lib/queue/job-processor';

// Load environment variables from the root .env file
config({ path: resolve(__dirname, '../.env') });
config();

const POLL_INTERVAL = 2000; // Poll every 2 seconds
const MAX_RETRIES = 3;

console.log('🚀 [Worker] Starting job processor worker...');
console.log('📊 [Worker] Poll interval:', POLL_INTERVAL, 'ms');
console.log('🔧 [Worker] Redis Config:', {
    host: process.env.REDIS_HOST?.substring(0, 20) + '...',
    port: process.env.REDIS_PORT,
    hasPassword: !!process.env.REDIS_PASSWORD
});

let isProcessing = false;
let shutdownRequested = false;

async function pollAndProcess() {
    if (isProcessing || shutdownRequested) {
        return;
    }

    isProcessing = true;

    try {
        // Get next job from queue
        const job = await jobQueue.pop();

        if (!job) {
            // No jobs in queue
            isProcessing = false;
            return;
        }

        console.log('📥 [Worker] Picked up job:', job.jobId);
        console.log('📝 [Worker] Prompt:', (job.prompt || 'No prompt').substring(0, 100) + '...');

        // Process the job
        await processGenerationJob(job);

        console.log('✅ [Worker] Job processed:', job.jobId);

    } catch (error) {
        console.error('❌ [Worker] Error processing job:', error);
    } finally {
        isProcessing = false;
    }
}

// Start polling
const pollInterval = setInterval(pollAndProcess, POLL_INTERVAL);

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️ [Worker] Shutdown signal received...');
    shutdownRequested = true;
    clearInterval(pollInterval);

    // Wait for current job to finish
    if (isProcessing) {
        console.log('⏳ [Worker] Waiting for current job to finish...');
        await new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (!isProcessing) {
                    clearInterval(checkInterval);
                    resolve(true);
                }
            }, 500);
        });
    }

    console.log('👋 [Worker] Shutdown complete');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n⚠️ [Worker] Termination signal received...');
    shutdownRequested = true;
    clearInterval(pollInterval);
    process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('💥 [Worker] Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 [Worker] Unhandled rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

console.log('✅ [Worker] Worker started successfully');
console.log('💡 [Worker] Press Ctrl+C to stop');
