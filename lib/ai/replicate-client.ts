import Replicate from 'replicate';

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

/**
 * Generate thumbnails using FLUX.1-schnell model
 */
export async function generateThumbnails(params: {
  prompt: string;
  uploadedImages?: string[];
  style?: string;
  numOutputs?: number;
}) {
  const { prompt, uploadedImages, style, numOutputs = 3 } = params;

  // Build the full prompt with style
  let fullPrompt = prompt;
  if (style) {
    fullPrompt = `${prompt}, ${style} style`;
  }

  // Prepare input for Replicate
  const input: any = {
    prompt: fullPrompt,
    num_outputs: numOutputs,
    aspect_ratio: '16:9',
    output_format: 'jpg',
    output_quality: 90,
  };

  // If user uploaded images, use them as reference
  if (uploadedImages && uploadedImages.length > 0) {
    // Use first uploaded image as base
    input.image = uploadedImages[0];
    input.prompt_strength = 0.8; // How much to follow the prompt vs the image
  }

  // Run the model
  const output = await replicate.run(
    'black-forest-labs/flux-schnell',
    { input }
  );

  return output;
}

/**
 * Get prediction status
 */
export async function getPredictionStatus(predictionId: string) {
  const prediction = await replicate.predictions.get(predictionId);
  return prediction;
}

/**
 * Cancel a running prediction
 */
export async function cancelPrediction(predictionId: string) {
  await replicate.predictions.cancel(predictionId);
}

/**
 * Refine an existing image with a new prompt
 */
export async function refineImage(params: {
  baseImageUrl: string;
  refinementPrompt: string;
  style?: string;
}) {
  const { baseImageUrl, refinementPrompt, style } = params;

  let fullPrompt = refinementPrompt;
  if (style) {
    fullPrompt = `${refinementPrompt}, ${style} style`;
  }

  const input = {
    image: baseImageUrl,
    prompt: fullPrompt,
    prompt_strength: 0.7, // Balance between original and new prompt
    num_outputs: 1,
    aspect_ratio: '16:9',
    output_format: 'jpg',
    output_quality: 90,
  };

  const output = await replicate.run(
    'black-forest-labs/flux-schnell',
    { input }
  );

  return output;
}
