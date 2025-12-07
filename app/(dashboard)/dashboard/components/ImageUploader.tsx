'use client';

import { useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';

interface ImageUploaderProps {
  onImagesChange: (imageUrls: string[]) => void;
}

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const {
    uploadedImages,
    isUploading,
    uploadError,
    uploadImage,
    removeImage,
  } = useImageUpload();

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length && uploadedImages.length + i < 3; i++) {
        await uploadImage(files[i]);
      }

      // Update parent component
      onImagesChange(uploadedImages.map((img) => img.url));
    },
    [uploadImage, uploadedImages, onImagesChange]
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = e.dataTransfer.files;
      if (!files || files.length === 0) return;

      for (let i = 0; i < files.length && uploadedImages.length + i < 3; i++) {
        await uploadImage(files[i]);
      }

      // Update parent component
      onImagesChange(uploadedImages.map((img) => img.url));
    },
    [uploadImage, uploadedImages, onImagesChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(
    (publicId: string) => {
      removeImage(publicId);
      // Update parent component
      const remaining = uploadedImages.filter((img) => img.publicId !== publicId);
      onImagesChange(remaining.map((img) => img.url));
    },
    [removeImage, uploadedImages, onImagesChange]
  );

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {uploadedImages.length < 3 && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-amber-500/50 transition-colors cursor-pointer bg-slate-800/30"
        >
          <input
            type="file"
            id="image-upload"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || uploadedImages.length >= 3}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <div className="p-4 bg-amber-500/10 rounded-full">
                <Upload className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="text-white font-medium">
                  {isUploading ? 'Uploading...' : 'Upload your images'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Drag & drop or click to browse (Max 3 images)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  JPEG, PNG, WebP • Max 10MB each
                </p>
              </div>
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          {uploadError}
        </div>
      )}

      {/* Uploaded Images Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {uploadedImages.map((image) => (
            <div
              key={image.publicId}
              className="relative group aspect-video rounded-lg overflow-hidden border border-slate-700"
            >
              <img
                src={image.url}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(image.publicId)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white">
                  {image.width} × {image.height}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <p className="text-xs text-slate-500 text-center">
          {uploadedImages.length} / 3 images uploaded
        </p>
      )}
    </div>
  );
}
