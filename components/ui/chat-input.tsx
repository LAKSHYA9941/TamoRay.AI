'use client';

import { Paperclip, ArrowUp, Sparkles, X } from 'lucide-react';
import { useState, useRef, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  onAttachClick?: () => void;
  tokensUsed?: number;
  totalTokens?: number;
  uploadedImages?: string[];
  onRemoveImage?: (index: number) => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Ask, Search or Chat...",
  disabled = false,
  onAttachClick,
  tokensUsed = 0,
  totalTokens = 100,
  uploadedImages = [],
  onRemoveImage,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const usagePercentage = totalTokens > 0 ? Math.round((tokensUsed / totalTokens) * 100) : 0;

  return (
    <div className="w-full">
      {/* Main Input Container */}
      <div
        className={cn(
          "relative rounded-3xl bg-[#2f2f2f] border transition-all duration-200",
          isFocused ? "border-slate-600" : "border-transparent",
          "shadow-lg"
        )}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className={cn(
            "w-full px-4 pt-4 pb-3 bg-transparent text-white placeholder-slate-500",
            "resize-none outline-none",
            "text-[15px] leading-6",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          style={{
            maxHeight: '200px',
            minHeight: '52px',
          }}
        />

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-3 pb-3 gap-2">
          {/* Left Side - Attach Button & Image Previews */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={onAttachClick}
              disabled={disabled}
              className={cn(
                "p-2 rounded-lg transition-colors flex-shrink-0",
                "hover:bg-slate-700/50 text-slate-400 hover:text-slate-200",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              title="Attach files"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Image Preview Thumbnails - Scrollable */}
            {uploadedImages.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide flex-1 min-w-0">
                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative group flex-shrink-0"
                  >
                    <div className="relative w-8 h-8 rounded-md overflow-hidden border border-slate-600/50 bg-slate-800">
                      <Image
                        src={image}
                        alt={`Upload ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {onRemoveImage && (
                        <button
                          onClick={() => onRemoveImage(index)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {uploadedImages.length > 0 && (
                  <span className="text-[10px] text-slate-500 whitespace-nowrap flex-shrink-0">
                    {uploadedImages.length}/5
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right Side - Usage & Send Button */}
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-400 font-medium">
              {usagePercentage}% used
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!value.trim() || disabled}
              className={cn(
                "p-2 rounded-lg transition-all duration-200",
                value.trim() && !disabled
                  ? "bg-white text-black hover:bg-slate-200"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              )}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
