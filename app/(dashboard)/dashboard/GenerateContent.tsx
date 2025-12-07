'use client';

import { MessageSquare } from 'lucide-react';
import { GenerationResults } from './components/GenerationResults';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

interface GenerateContentProps {
  generationState: {
    isGenerating: boolean;
    generationResponse: any;
    error: string | null;
    progress: number;
    reset: () => void;
  };
  selectedStyle: string;
  onStyleChange: (style: string) => void;
}

export function GenerateContent({ generationState, selectedStyle }: GenerateContentProps) {
  const {
    isGenerating,
    generationResponse,
    error,
    progress,
    reset,
  } = generationState;

  return (
    <div className="flex flex-col items-center w-full">
      {!generationResponse && !isGenerating && !error && (
        // Initial empty state
        <div className="flex flex-col items-center text-center justify-center flex-1">
          <div className="mb-8 p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-full border border-amber-500/20">
            <MessageSquare className="w-12 h-12 text-amber-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Hello there!
          </h1>
          <p className="text-xl text-slate-300 max-w-md mb-4">
            How can I help you create amazing thumbnails today?
          </p>
          <p className="text-sm text-slate-500">
            Selected style: <span className="text-amber-400">{selectedStyle}</span>
          </p>
        </div>
      )}

      {isGenerating && (
        <LoadingState
          message="Generating your thumbnail..."
          progress={progress}
          variant="generation"
        />
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={reset}
        />
      )}

      {generationResponse && !isGenerating && (
        <div className="w-full space-y-6 py-4">
          <GenerationResults
            generationResponse={generationResponse}
            onRegenerate={reset}
          />

          <div className="flex justify-center pt-4">
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
            >
              Clear & Generate New
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
