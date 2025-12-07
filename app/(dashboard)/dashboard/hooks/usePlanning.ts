'use client';

import { useState, useCallback } from 'react';
import type { PlanRequest, PlanResponse, WebSearchResult } from '../types';

interface UsePlanningReturn {
  isPlanning: boolean;
  planResponse: PlanResponse | null;
  error: string | null;
  streamingText: string;
  sources: WebSearchResult[];
  startPlanning: (request: PlanRequest) => Promise<void>;
  reset: () => void;
}

export function usePlanning(): UsePlanningReturn {
  const [isPlanning, setIsPlanning] = useState(false);
  const [planResponse, setPlanResponse] = useState<PlanResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [sources, setSources] = useState<WebSearchResult[]>([]);

  const startPlanning = useCallback(async (request: PlanRequest) => {
    setIsPlanning(true);
    setError(null);
    setStreamingText('');
    setSources([]);
    setPlanResponse(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create plan');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let fullText = '';
      const collectedSources: any[] = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                fullText += data.content;
                setStreamingText(fullText);
              } else if (data.type === 'tool_call') {
                // Handle tool call notification
                console.log('Tool call:', data.tool);
              } else if (data.type === 'tool_result') {
                // Handle tool results (web search)
                if (data.result) {
                  collectedSources.push(data.result);
                  setSources([...collectedSources]);
                }
              } else if (data.type === 'complete') {
                // Final response
                const finalResponse: PlanResponse = {
                  id: `plan_${Date.now()}`,
                  prompt: request.prompt,
                  steps: parseStepsFromText(data.response),
                  summary: data.response,
                  sources: collectedSources,
                  createdAt: new Date().toISOString(),
                  status: 'completed',
                };
                setPlanResponse(finalResponse);
                setStreamingText(data.response);
              } else if (data.type === 'error') {
                throw new Error(data.error);
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Planning error:', err);
    } finally {
      setIsPlanning(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsPlanning(false);
    setPlanResponse(null);
    setError(null);
    setStreamingText('');
    setSources([]);
  }, []);

  return {
    isPlanning,
    planResponse,
    error,
    streamingText,
    sources,
    startPlanning,
    reset,
  };
}

// Helper function to parse steps from text
function parseStepsFromText(text: string): any[] {
  // Simple parsing - you can make this more sophisticated
  const lines = text.split('\n');
  const steps: any[] = [];
  let currentStep: any = null;

  lines.forEach((line, index) => {
    // Look for numbered items (1., 2., etc.)
    const match = line.match(/^(\d+)\.\s+(.+)/);
    if (match) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        id: `step_${index}`,
        title: match[2],
        description: '',
        status: 'completed',
        timestamp: new Date().toISOString(),
      };
    } else if (currentStep && line.trim()) {
      currentStep.description += line + '\n';
    }
  });

  if (currentStep) {
    steps.push(currentStep);
  }

  return steps;
}
