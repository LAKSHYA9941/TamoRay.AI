import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image from URL to Cloudinary
 */
export async function uploadFromUrl(
  imageUrl: string,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
) {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: options.folder || 'thumbnail-generator',
      public_id: options.publicId,
      overwrite: true,
      resource_type: 'image',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

/**
 * Upload image from buffer (for user uploads)
 */
export async function uploadFromBuffer(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
  } = {}
): Promise<{
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || 'thumbnail-generator/uploads',
        public_id: options.publicId,
        overwrite: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 */
export async function deleteImage(publicId: string) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export default cloudinary;
