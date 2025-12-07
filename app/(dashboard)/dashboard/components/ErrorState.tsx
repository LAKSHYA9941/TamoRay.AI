'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({ 
  title = 'Something went wrong',
  message,
  onRetry,
  details 
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 max-w-2xl mx-auto">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {message}
        </AlertDescription>
      </Alert>

      {details && (
        <details className="w-full mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300">
            View error details
          </summary>
          <pre className="mt-2 text-xs text-slate-500 overflow-auto">
            {details}
          </pre>
        </details>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          className="mt-6"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
