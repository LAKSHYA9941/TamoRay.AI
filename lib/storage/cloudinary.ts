import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFromBuffer = (buffer: Buffer, options: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        options,
      (error, result) => {
          if (error) {
              reject(error);
        } else {
            resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

export default cloudinary;
