'use client';

import { useState, useCallback } from 'react';

interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

interface UseImageUploadReturn {
  uploadedImages: UploadedImage[];
  isUploading: boolean;
  uploadError: string | null;
  uploadImage: (file: File) => Promise<void>;
  removeImage: (publicId: string) => void;
  clearImages: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    // Check if we already have 3 images
    if (uploadedImages.length >= 3) {
      setUploadError('Maximum 3 images allowed');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      setUploadedImages((prev) => [
        ...prev,
        {
          url: data.url,
          publicId: data.publicId,
          width: data.width,
          height: data.height,
        },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setUploadError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImages.length]);

  const removeImage = useCallback((publicId: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.publicId !== publicId));
  }, []);

  const clearImages = useCallback(() => {
    setUploadedImages([]);
    setUploadError(null);
  }, []);

  return {
    uploadedImages,
    isUploading,
    uploadError,
    uploadImage,
    removeImage,
    clearImages,
  };
}
