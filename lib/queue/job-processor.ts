import prisma from "@/lib/prisma";
import { jobStatus } from '@/lib/queue/redis';
import { generateThumbnails, refineImage } from '@/lib/ai/replicate-client';
import { uploadFromUrl } from '@/lib/storage/cloudinary';

/**
 * Process a generation job
 */
export async function processGenerationJob(job: any) {
  const startTime = Date.now();

  try {
    console.log(`[Worker] Processing job ${job.jobId}`);

    // Update status: Processing
    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'processing',
          progress: 10,
          currentStep: 'Initializing AI generation...',
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'processing',
        progress: 10,
        currentStep: 'Initializing AI generation...',
        eta: 40,
      }),
    ]);

    // Generate with Replicate
    await jobStatus.update(job.jobId, {
      progress: 30,
      currentStep: 'Generating 3 thumbnail variations...',
      eta: 30,
    });

    const replicateOutput = await generateThumbnails({
      prompt: job.prompt,
      uploadedImages: job.uploadedImages,
      style: job.stylePreset,
      numOutputs: 3,
    });

    // replicateOutput is an array of image URLs
    const generatedUrls = Array.isArray(replicateOutput)
      ? replicateOutput
      : [replicateOutput];

    if (generatedUrls.length === 0) {
      throw new Error('No images generated');
    }

    // Upload to Cloudinary
    await jobStatus.update(job.jobId, {
      progress: 70,
      currentStep: 'Uploading images to cloud storage...',
      eta: 10,
    });

    const uploadedResults = [];

    for (let i = 0; i < generatedUrls.length; i++) {
      const result = await uploadFromUrl(generatedUrls[i], {
        folder: `thumbnail-generator/${job.userId}`,
        publicId: `${job.jobId}_v${i + 1}`,
      });

      uploadedResults.push({
        url: result.url,
        publicId: result.publicId,
        width: result.width,
        height: result.height,
        format: result.format,
        variationIndex: i,
      });
    }

    // Mark as completed
    const processingTime = Date.now() - startTime;

    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'completed',
          progress: 100,
          currentStep: 'Done!',
          results: uploadedResults,
          completedAt: new Date(),
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'completed',
        progress: 100,
        currentStep: 'Done!',
        eta: 0,
        results: JSON.stringify(uploadedResults),
      }),
    ]);

    console.log(`[Worker] Job ${job.jobId} completed in ${processingTime}ms`);
  } catch (error: any) {
    console.error(`[Worker] Job ${job.jobId} failed:`, error);

    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'failed',
        error: error.message,
      }),
    ]);

    // Refund token
    await prisma.user.update({
      where: { id: job.userId },
      data: { tokens: { increment: 1 } },
    });
  }
}

/**
 * Process a refinement job
 */
export async function processRefinementJob(job: any) {
  const startTime = Date.now();

  try {
    console.log(`[Worker] Processing refinement job ${job.jobId}`);

    // Update status
    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'processing',
          progress: 20,
          currentStep: 'Refining selected image...',
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'processing',
        progress: 20,
        currentStep: 'Refining selected image...',
        eta: 25,
      }),
    ]);

    // Refine with Replicate
    const replicateOutput = await refineImage({
      baseImageUrl: job.baseImageUrl,
      refinementPrompt: job.prompt,
      style: job.stylePreset,
    });

    const refinedUrl = Array.isArray(replicateOutput)
      ? replicateOutput[0]
      : replicateOutput;

    // Upload to Cloudinary
    await jobStatus.update(job.jobId, {
      progress: 80,
      currentStep: 'Uploading refined image...',
      eta: 5,
    });

    const result = await uploadFromUrl(refinedUrl, {
      folder: `thumbnail-generator/${job.userId}/refined`,
      publicId: `${job.jobId}_refined`,
    });

    const uploadedResult = {
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      isRefinement: true,
    };

    // Mark as completed
    const processingTime = Date.now() - startTime;

    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'completed',
          progress: 100,
          currentStep: 'Done!',
          results: [uploadedResult],
          completedAt: new Date(),
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'completed',
        progress: 100,
        currentStep: 'Done!',
        eta: 0,
        results: JSON.stringify([uploadedResult]),
      }),
    ]);

    console.log(`[Worker] Refinement job ${job.jobId} completed in ${processingTime}ms`);
  } catch (error: any) {
    console.error(`[Worker] Refinement job ${job.jobId} failed:`, error);

    await Promise.all([
      prisma.job.update({
        where: { id: job.jobId },
        data: {
          status: 'failed',
          errorMessage: error.message,
        },
      }),
      jobStatus.set(job.jobId, {
        status: 'failed',
        error: error.message,
      }),
    ]);

    // Refund token
    await prisma.user.update({
      where: { id: job.userId },
      data: { tokens: { increment: 1 } },
    });
  }
}
