'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { PlanResponse, PlanningStep, WebSearchResult } from '../types';
import { useState } from 'react';

interface PlanningResultsProps {
  planResponse?: PlanResponse | null;
  streamingText?: string;
  sources?: WebSearchResult[];
  isStreaming?: boolean;
}

export function PlanningResults({ 
  planResponse, 
  streamingText, 
  sources = [],
  isStreaming = false 
}: PlanningResultsProps) {
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current && isStreaming) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [streamingText, isStreaming]);

  const handleCopy = async () => {
    const text = streamingText || planResponse?.summary || '';
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayText = streamingText || planResponse?.summary || '';
  const displaySources = sources.length > 0 ? sources : (planResponse?.sources || []);

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Main Plan Content */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/50">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-blue-400" />
                Your Plan
              </CardTitle>
              <CardDescription>
                {isStreaming ? 'Generating plan...' : 'Plan generated successfully'}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="border-slate-700"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={textRef}
            className="prose prose-invert max-w-none"
          >
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">
              {displayText}
              {isStreaming && (
                <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Web Search Sources */}
      {displaySources.length > 0 && (
        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-400" />
              Research Sources
              <Badge variant="info">{displaySources.length}</Badge>
            </CardTitle>
            <CardDescription>
              Information gathered from web search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {displaySources.map((source, index) => (
                <AccordionItem key={index} value={`source-${index}`}>
                  <AccordionTrigger className="text-left hover:text-blue-400">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-1">
                        {index + 1}
                      </Badge>
                      <div>
                        <p className="font-medium text-white">
                          {typeof source === 'object' && 'title' in source 
                            ? source.title 
                            : `Source ${index + 1}`}
                        </p>
                        {typeof source === 'object' && 'url' in source && (
                          <p className="text-xs text-slate-500 mt-1">
                            {source.url}
                          </p>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-12 pr-4 space-y-2">
                      {typeof source === 'object' && 'snippet' in source && (
                        <p className="text-sm text-slate-300">{source.snippet}</p>
                      )}
                      {typeof source === 'object' && 'url' in source && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                        >
                          Visit source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Planning Steps (if available) */}
      {planResponse?.steps && planResponse.steps.length > 0 && (
        <Card className="border-slate-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Action Steps</CardTitle>
            <CardDescription>
              Breakdown of your plan into actionable steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {planResponse.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex gap-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-400 font-semibold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-medium text-white">{step.title}</h4>
                    {step.description && (
                      <p className="text-sm text-slate-400">{step.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
