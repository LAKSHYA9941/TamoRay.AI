'use client';

import { ListChecks } from 'lucide-react';
import { PlanningResults } from './components/PlanningResults';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

interface PlanContentProps {
  planningState: {
    isPlanning: boolean;
    planResponse: any;
    error: string | null;
    streamingText: string;
    sources: any[];
    reset: () => void;
  };
  includeWebSearch: boolean;
}

export function PlanContent({ planningState, includeWebSearch }: PlanContentProps) {
  const {
    isPlanning,
    planResponse,
    error,
    streamingText,
    sources,
    reset,
  } = planningState;

  // Show results if we have streaming text or a completed plan
  const showResults = streamingText || planResponse;

  return (
    <div className="flex flex-col items-center w-full">
      {!showResults && !isPlanning && !error && (
        // Initial empty state
        <div className="flex flex-col items-center text-center justify-center flex-1">
          <div className="mb-8 p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-full border border-blue-500/20">
            <ListChecks className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Plan Your Content
          </h1>
          <p className="text-xl text-slate-300 max-w-md mb-4">
            Let AI help you plan and organize your thumbnail ideas with research-backed insights.
          </p>
          <p className="text-sm text-slate-500">
            {includeWebSearch ? '🔍 Web search enabled' : '💡 Using AI knowledge'}
          </p>
        </div>
      )}

      {isPlanning && !showResults && (
        <LoadingState
          message="Creating your plan with AI research..."
          variant="planning"
        />
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={reset}
        />
      )}

      {showResults && (
        <div className="w-full space-y-6 py-4">
          <PlanningResults
            planResponse={planResponse}
            streamingText={streamingText}
            sources={sources}
            isStreaming={isPlanning}
          />

          {!isPlanning && (
            <div className="flex justify-center pt-4">
              <button
                onClick={reset}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-colors"
              >
                Clear & Start New Plan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
