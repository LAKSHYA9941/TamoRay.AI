'use client';

import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingStateProps {
  message?: string;
  progress?: number;
  variant?: 'planning' | 'generation';
}

export function LoadingState({ 
  message = 'Processing...', 
  progress,
  variant = 'planning' 
}: LoadingStateProps) {
  const colors = {
    planning: 'text-blue-400',
    generation: 'text-amber-400',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8">
      <div className="relative">
        <div className={`absolute inset-0 blur-xl opacity-50 ${
          variant === 'planning' ? 'bg-blue-500' : 'bg-amber-500'
        } rounded-full`} />
        <Loader2 className={`w-16 h-16 ${colors[variant]} animate-spin relative z-10`} />
      </div>
      
      <div className="text-center space-y-3 w-full max-w-md">
        <p className="text-lg font-medium text-white">{message}</p>
        
        {progress !== undefined && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-slate-400">{progress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}
