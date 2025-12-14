'use client';

import { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { PlanContent } from '@/app/(dashboard)/dashboard/PlanContent';
import { usePlanning } from '@/app/(dashboard)/dashboard/hooks/usePlanning';
import { Badge } from '@/components/ui/badge';
import { ChatInput } from '@/components/ui/chat-input';

export default function PlanPage() {
  const [inputValue, setInputValue] = useState('');
  const [includeWebSearch, setIncludeWebSearch] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const planning = usePlanning();
  
  const handleSend = () => {
    if (!inputValue.trim()) return;

    planning.startPlanning({
      prompt: inputValue,
      uploadedImages: uploadedImages,
      options: {
        includeWebSearch,
        researchDepth: 'detailed',
      },
    });

    setInputValue('');
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const newImages: string[] = [];
    const remainingSlots = 5 - uploadedImages.length;
    const filesToProcess = Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newImages.push(result);
          if (newImages.length === filesToProcess) {
            setUploadedImages([...uploadedImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const tokensUsed = 1;
  const totalTokens = 10;

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          <PlanContent
            planningState={planning}
            includeWebSearch={includeWebSearch}
          />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/95 to-slate-950/50">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          {/* Options Row */}
          <div className="flex items-center gap-2 px-1">
            <button
              type="button"
              onClick={() => setIncludeWebSearch(!includeWebSearch)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${includeWebSearch
                ? 'bg-blue-500/10 border-blue-500/50 text-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                }`}
              disabled={planning.isPlanning}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Web Search</span>
              {includeWebSearch && (
                <Badge variant="info" className="ml-1 text-xs px-1.5 py-0">ON</Badge>
              )}
            </button>
          </div>

          {/* Chat Input */}
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSend}
            placeholder="What would you like to plan?"
            disabled={planning.isPlanning}
            onAttachClick={handleAttachClick}
            tokensUsed={tokensUsed}
            totalTokens={totalTokens}
            uploadedImages={uploadedImages}
            onRemoveImage={removeImage}
          />

          {/* Footer Text */}
          <p className="text-xs text-center text-slate-500 px-4">
            {uploadedImages.length > 0
              ? "💡 AI will analyze your images and create a contextual plan"
              : "💡 AI-powered planning with web research"}
          </p>
        </div>
      </div>
    </div>
  );
}
