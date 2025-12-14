import redisClient from '../redis';

export interface QueueJob {
    jobId: string;
    userId: string;
    prompt?: string;
    uploadedImages?: string[];
    stylePreset?: string;
    queuedAt: string;
    parentJobId?: string; // For refinement jobs
    selectedImage?: string; // For refinement jobs
    baseImageUrl?: string; // For refinement jobs
    refinementPrompt?: string; // For refinement jobs
}

export interface JobStatusData {
    status: 'queued' | 'processing' | 'completed' | 'failed';
    progress: number;
    currentStep: string;
    eta: number;
    results?: string; // JSON string of results
    error?: string;
}

const QUEUE_KEY = 'job:queue';
const STATUS_PREFIX = 'job:status:';

// Ensure Redis connection
async function ensureConnection() {
    if (!redisClient.isOpen) {
        console.log('🔌 [Redis] Connecting to Redis Cloud...');
        try {
            await redisClient.connect();
            console.log('✅ [Redis] Connected successfully');
        } catch (error) {
            console.error('❌ [Redis] Connection failed:', error);
            throw error;
        }
    }
}

export const jobQueue = {
    push: async (job: QueueJob) => {
        await ensureConnection();
        console.log('📤 [Redis Queue] Pushing job:', job.jobId);
        await redisClient.rPush(QUEUE_KEY, JSON.stringify(job));
        console.log('✅ [Redis Queue] Job pushed successfully');
    },
    pop: async (): Promise<QueueJob | null> => {
        await ensureConnection();
        const result = await redisClient.lPop(QUEUE_KEY);
        if (result) {
            const job = JSON.parse(result);
            console.log('📥 [Redis Queue] Popped job:', job.jobId);
            return job;
        }
        return null;
    }
};

export const jobStatus = {
    set: async (jobId: string, status: JobStatusData) => {
        await ensureConnection();
        const data: Record<string, string> = {};
        for (const [key, value] of Object.entries(status)) {
            if (value !== undefined && value !== null) {
                data[key] = String(value);
            }
        }
        await redisClient.hSet(`${STATUS_PREFIX}${jobId}`, data);
        await redisClient.expire(`${STATUS_PREFIX}${jobId}`, 86400);
        console.log('💾 [Redis Status] Updated status for job:', jobId, 'Status:', status.status);
    },
    get: async (jobId: string) => {
        await ensureConnection();
        const result = await redisClient.hGetAll(`${STATUS_PREFIX}${jobId}`);
        return result;
    }
};
