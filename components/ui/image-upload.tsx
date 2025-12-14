'use client';

import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  disabled = false 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || disabled) return;

    const newImages: string[] = [];
    const remainingSlots = maxImages - images.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          if (newImages.length === filesToProcess) {
            onImagesChange([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canAddMore = images.length < maxImages;

  return (
    <div className="w-full">
      {/* Image Previews */}
      <AnimatePresence mode="popLayout">
        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <div className="flex flex-wrap gap-2">
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900">
                    <Image
                      src={image}
                      alt={`Upload ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {images.length} / {maxImages} images • Click to remove
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-xl p-4 transition-all cursor-pointer
            ${isDragging 
              ? 'border-amber-500/50 bg-amber-500/5' 
              : 'border-slate-700/50 hover:border-slate-600 bg-slate-900/30'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-800/50">
              {isDragging ? (
                <Upload className="w-5 h-5 text-amber-400" />
              ) : (
                <ImageIcon className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">
                {isDragging ? 'Drop images here' : 'Upload reference images'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Click or drag up to {maxImages - images.length} more images
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
