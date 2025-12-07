import { Redis } from '@upstash/redis';

// Initialize Upstash Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Job queue operations
export const jobQueue = {
  /**
   * Add a job to the queue
   */
  async push(job: any) {
    await redis.lpush('job_queue', JSON.stringify(job));
  },

  /**
   * Get next job from queue (FIFO)
   */
  async pop(): Promise<any | null> {
    const jobData = await redis.rpop('job_queue');
    return jobData ? JSON.parse(jobData as string) : null;
  },

  /**
   * Get queue length
   */
  async length(): Promise<number> {
    return await redis.llen('job_queue');
  },

  /**
   * Peek at next job without removing
   */
  async peek(): Promise<any | null> {
    const jobs = await redis.lrange('job_queue', -1, -1);
    return jobs.length > 0 ? JSON.parse(jobs[0] as string) : null;
  },
};

// Job status cache operations
export const jobStatus = {
  /**
   * Set job status in cache
   */
  async set(jobId: string, status: any, ttl: number = 3600) {
    await redis.hset(`job_status:${jobId}`, status);
    await redis.expire(`job_status:${jobId}`, ttl);
  },

  /**
   * Get job status from cache
   */
  async get(jobId: string): Promise<any | null> {
    const status = await redis.hgetall(`job_status:${jobId}`);
    return status && Object.keys(status).length > 0 ? status : null;
  },

  /**
   * Delete job status from cache
   */
  async delete(jobId: string) {
    await redis.del(`job_status:${jobId}`);
  },

  /**
   * Update specific fields
   */
  async update(jobId: string, fields: any) {
    await redis.hset(`job_status:${jobId}`, fields);
  },
};
