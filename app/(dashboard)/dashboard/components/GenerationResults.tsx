'use client';

import { Download, ExternalLink, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { useState } from 'react';

interface GenerationResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  variationIndex: number;
}

interface GenerationResultsProps {
  generationResults: GenerationResult[];
  onRegenerate?: () => void;
}

export function GenerationResults({ 
  generationResults,
  onRegenerate 
}: GenerationResultsProps) {
  const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});

  const handleDownload = async (url: string, index: number) => {
    try {
      setLoadingStates(prev => ({ ...prev, [index]: true }));

      // Fetch the image
      const response = await fetch(url);
      const blob = await response.blob();

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `thumbnail-${Date.now()}-${index}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleOpenInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!generationResults || generationResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Chat-like message bubbles for each result */}
      {generationResults.map((result, index) => (
        <div
          key={`${result.publicId}-${index}`}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Message bubble */}
          <div className="flex gap-3 items-start">
            {/* AI Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>

            {/* Message Content */}
            <div className="flex-1 max-w-md">
              {/* Compact Image Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-amber-500/30 transition-all group">
                {/* Image Container - Smaller size */}
                <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                  <Image
                    src={result.url}
                    alt={`Generated thumbnail ${index + 1}`}
                    fill
                    className="object-contain transition-transform group-hover:scale-105 duration-300"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={index === 0}
                  />
                </div>

                {/* Compact Info Bar */}
                <div className="px-3 py-2 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Badge variant="success" className="text-xs px-2 py-0">
                        {result.width} × {result.height}
                      </Badge>
                      <span className="text-slate-600">•</span>
                      <span className="uppercase">{result.format}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenInNewTab(result.url)}
                        className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(result.url, index)}
                        disabled={loadingStates[index]}
                        className="p-1.5 rounded-md hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 transition-colors disabled:opacity-50"
                        title="Download"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <p className="text-xs text-slate-600 mt-1.5 ml-1">
                Just now
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
