'use client';

import { useState, useCallback } from 'react';

interface GenerationResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  variationIndex: number;
}

interface GenerationRequest {
  prompt: string;
  uploadedImages?: string[];
  style?: string;
}

interface UseGenerationReturn {
  isGenerating: boolean;
  jobId: string | null;
  generationResults: GenerationResult[] | null;
  error: string | null;
  progress: number;
  currentStep: string;
  eta: number;
  startGeneration: (request: GenerationRequest) => Promise<void>;
  reset: () => void;
}

export function useGeneration(): UseGenerationReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [generationResults, setGenerationResults] = useState<GenerationResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [eta, setEta] = useState(0);

  const startGeneration = useCallback(async (request: GenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentStep('Starting generation...');
    setGenerationResults(null);
    setJobId(null);

    try {
      // Start generation job
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start generation');
      }

      const data = await response.json();
      setJobId(data.jobId);

      // Poll for status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/job-status/${data.jobId}`);
          
          if (!statusResponse.ok) {
            throw new Error('Failed to fetch job status');
          }

          const statusData = await statusResponse.json();
          
          setProgress(statusData.progress || 0);
          setCurrentStep(statusData.currentStep || '');
          setEta(statusData.eta || 0);

          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            setGenerationResults(statusData.results);
            setIsGenerating(false);
            setProgress(100);
            setCurrentStep('Done!');
          } else if (statusData.status === 'failed') {
            clearInterval(pollInterval);
            throw new Error(statusData.error || 'Generation failed');
          }
        } catch (err) {
          clearInterval(pollInterval);
          throw err;
        }
      }, 2000); // Poll every 2 seconds

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setIsGenerating(false);
      console.error('Generation error:', err);
    }
  }, []);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setJobId(null);
    setGenerationResults(null);
    setError(null);
    setProgress(0);
    setCurrentStep('');
    setEta(0);
  }, []);

  return {
    isGenerating,
    jobId,
    generationResults,
    error,
    progress,
    currentStep,
    eta,
    startGeneration,
    reset,
  };
}
