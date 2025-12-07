'use client';

import { Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { GenerateResponse } from '../types';

interface GenerationResultsProps {
  generationResponse: GenerateResponse;
  onRegenerate?: () => void;
}

export function GenerationResults({ 
  generationResponse,
  onRegenerate 
}: GenerationResultsProps) {
  const handleDownload = (url: string, id: string) => {
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `thumbnail-${id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-amber-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">
              Generated Thumbnails
            </h3>
            <p className="text-sm text-slate-400">
              {generationResponse.thumbnails.length} variation{generationResponse.thumbnails.length !== 1 ? 's' : ''} created
            </p>
          </div>
        </div>
        {onRegenerate && (
          <Button
            variant="outline"
            onClick={onRegenerate}
            className="border-slate-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        )}
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {generationResponse.thumbnails.map((thumbnail) => (
          <Card 
            key={thumbnail.id}
            className="border-amber-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/50 overflow-hidden group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base text-white">
                    Thumbnail
                  </CardTitle>
                  {thumbnail.style && (
                    <Badge variant="warning" className="text-xs">
                      {thumbnail.style}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => handleDownload(thumbnail.url, thumbnail.id)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                {/* Placeholder - Replace with actual image when available */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-amber-400" />
                    </div>
                    <p className="text-sm text-slate-400">
                      Thumbnail generated
                    </p>
                  </div>
                </div>
                {/* Uncomment when you have actual images */}
                {/* <img
                  src={thumbnail.url}
                  alt={thumbnail.prompt}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                /> */}
              </div>
              
              {thumbnail.metadata && (
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span>{thumbnail.metadata.width} × {thumbnail.metadata.height}</span>
                  <span className="uppercase">{thumbnail.metadata.format}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompt Info */}
      <Card className="border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm text-white">Original Prompt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-300">
            {generationResponse.thumbnails[0]?.prompt || 'No prompt available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
