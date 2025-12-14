import { jobQueue, jobStatus, QueueJob } from './redis';
import prisma from '@/lib/prisma';
import Replicate from 'replicate';
import cloudinary from '@/lib/storage/cloudinary';

export { jobQueue, jobStatus };

// Configuration from reference
const REPLICATE_VERSION = process.env.REPLICATE_FLUX_SCHNELL_VERSION || "c846a69991daf4c0e5d016514849d14ee5b2e6846ce6b9d6f21369e564cfe51e";
const SYSTEM_PROMPT = `You are an expert at making YouTube thumbnails. Focus on clear, impactful imagery and strong visuals. Consider the following when generating:
- Catchy: it should grab attention quickly
- Relevance: it should accurately represent the video content
- Emotion/Intrigue: it should evoke curiosity or a strong emotion
- Background Style: The background should be giving thumbnail a dramatic, intense, and user desired feeling.
- Follow the Rule of Thirds — place faces near the intersections to draw attention.
- ALWAYS USE THE REFERENCE IMAGE IF IT IS PROVIDED AND ENHANCE SO THAT THE USER GET THE BEST VERSION OF HIM/HERSELF`;

export async function processGenerationJob(job: QueueJob) {
    console.log('🚀 [Job Processor] Starting job:', job.jobId);

    // Initialize Replicate lazily safely
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) {
        console.error("❌ [Job Processor] Missing REPLICATE_API_TOKEN");
        await Promise.all([
            prisma.job.update({
                where: { id: job.jobId },
                data: {
                    status: 'failed',
                    errorMessage: "Server configuration error: Missing AI credentials"
                }
            }),
            jobStatus.set(job.jobId, {
                status: 'failed',
                progress: 0,
                currentStep: 'Failed',
                eta: 0,
                error: "Server configuration error: Missing AI credentials"
            })
        ]);
        return;
    }

    const replicate = new Replicate({
        auth: token,
    });

    try {
        // Update status: Starting
        await jobStatus.set(job.jobId, {
            status: 'processing',
            progress: 10,
            currentStep: 'Starting generation...',
            eta: 40
        });

        // 1. Prepare Inputs
        let fullPrompt = `${SYSTEM_PROMPT}\n\nGenerate a YouTube thumbnail for: ${job.prompt}`;
        if (job.stylePreset) {
            fullPrompt += `\nStyle: ${job.stylePreset}`;
        }

        const input: any = {
            prompt: fullPrompt,
            aspect_ratio: "16:9",
            output_format: "png",
            output_quality: 100,
            num_outputs: 1,
            go_fast: true,
        };

        // Handle uploaded images (use the first one as reference if available)
        if (job.uploadedImages && Array.isArray(job.uploadedImages) && job.uploadedImages.length > 0) {
            input.image = job.uploadedImages[0];
            console.log('📸 [Job Processor] Using reference image:', job.uploadedImages[0]);
        }

        // 2. Call Replicate
        await jobStatus.set(job.jobId, {
            status: 'processing',
            progress: 30,
            currentStep: 'Generating with AI...',
            eta: 30
        });

        console.log("🤖 [Job Processor] Calling Replicate with model: black-forest-labs/flux-1.1-pro");
        console.log("📝 [Job Processor] Prompt:", fullPrompt.substring(0, 100) + "...");

        const output = await replicate.run(
            "black-forest-labs/flux-1.1-pro",
            { input }
        );

        console.log("✅ [Job Processor] Replicate output received");

        if (!output || !Array.isArray(output) || output.length === 0) {
            throw new Error("No output received from Replicate");
        }

        // Handle FileOutput object from Replicate
        const replicateOutput = output[0];
        let replicateImageUrl: string;

        // Check if it's a FileOutput object with url() method
        if (typeof replicateOutput === 'object' && replicateOutput !== null && 'url' in replicateOutput) {
            // It's a FileOutput object, call url() to get the URL
            const urlResult = await (replicateOutput as any).url();

            // Convert URL object to string if needed
            if (typeof urlResult === 'object' && urlResult !== null && 'href' in urlResult) {
                replicateImageUrl = urlResult.href;
            } else if (typeof urlResult === 'string') {
                replicateImageUrl = urlResult;
            } else {
                replicateImageUrl = String(urlResult);
            }

            console.log("🖼️ [Job Processor] Extracted URL from FileOutput:", replicateImageUrl);
        } else if (typeof replicateOutput === 'string') {
            // It's already a string URL
            replicateImageUrl = replicateOutput;
            console.log("🖼️ [Job Processor] Image URL from Replicate:", replicateImageUrl);
        } else {
            console.error("❌ [Job Processor] Unexpected output format:", replicateOutput);
            throw new Error("Unexpected output format from Replicate");
        }

        // 3. Upload to Cloudinary
        await jobStatus.set(job.jobId, {
            status: 'processing',
            progress: 80,
            currentStep: 'Processing final image...',
            eta: 10
        });

        console.log("☁️ [Job Processor] Uploading to Cloudinary...");

        const uploadResult = await cloudinary.uploader.upload(replicateImageUrl, {
            folder: "thumbnails",
            resource_type: "image",
            transformation: [
                {
                    width: 1280,
                    height: 720,
                    crop: "pad",
                    background: "auto",
                    quality: "auto",
                    fetch_format: "auto"
                },
            ],
        });

        const finalImageUrl = uploadResult.secure_url;
        console.log("✅ [Job Processor] Cloudinary upload complete:", finalImageUrl);

        // Format results to match frontend expectations
        const results = [
            {
                url: finalImageUrl,
                publicId: uploadResult.public_id,
                width: uploadResult.width,
                height: uploadResult.height,
                format: uploadResult.format,
                variationIndex: 0
            }
        ];

        // 4. Update DB
        await prisma.job.update({
            where: { id: job.jobId },
            data: {
                status: 'completed',
                progress: 100,
                results: results,
                completedAt: new Date()
            }
        });

        // 5. Update Redis
        await jobStatus.set(job.jobId, {
            status: 'completed',
            progress: 100,
            currentStep: 'Completed',
            eta: 0,
            results: JSON.stringify(results)
        });

        console.log("🎉 [Job Processor] Job completed successfully:", job.jobId);

    } catch (error) {
        console.error('❌ [Job Processor] Job failed:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        await Promise.all([
            prisma.job.update({
                where: { id: job.jobId },
                data: {
                    status: 'failed',
                    errorMessage: errorMessage
                }
            }),
            jobStatus.set(job.jobId, {
                status: 'failed',
                progress: 0,
                currentStep: 'Failed',
                eta: 0,
                error: errorMessage
            })
        ]);
    }
}

export async function processRefinementJob(job: QueueJob) {
    console.log('🔄 [Job Processor] Processing refinement job:', job.jobId);
    // Reuse generation logic for now or implement specific refinement logic
    return processGenerationJob(job);
}
