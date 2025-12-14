'use client';

import { History, Download, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';

interface HistoryContentProps {
  historyState: {
    jobs: any[];
    pagination: any;
    isLoading: boolean;
    error: string | null;
    fetchHistory: (page: number) => Promise<void>;
    refresh: () => Promise<void>;
  };
}

export function HistoryContent({ historyState }: HistoryContentProps) {
  const { jobs, pagination, isLoading, error, fetchHistory, refresh } = historyState;

  const handleDownload = async (url: string, jobId: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `thumbnail-${jobId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isLoading && jobs.length === 0) {
    return (
      <LoadingState
        message="Loading your history..."
        progress={50}
        variant="generation"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refresh}
      />
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center text-center justify-center flex-1 py-12">
        <div className="mb-8 p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-full border border-purple-500/20">
          <History className="w-12 h-12 text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">
          No History Yet
        </h2>
        <p className="text-lg text-slate-300 max-w-md">
          Your generated thumbnails will appear here. Start creating to build your history!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg border border-purple-500/30">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">
              Generation History
            </h2>
            <p className="text-sm text-slate-400">
              {pagination?.totalCount || 0} total generations
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={refresh}
          disabled={isLoading}
          className="border-slate-700 hover:border-purple-500/50"
        >
          Refresh
        </Button>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => {
          const result = Array.isArray(job.results) && job.results.length > 0 ? job.results[0] : null;
          
          return (
            <Card 
              key={job.id}
              className="border-purple-500/20 bg-gradient-to-br from-slate-900/90 to-slate-800/50 overflow-hidden group hover:border-purple-500/40 transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm text-white truncate">
                      {job.prompt.substring(0, 60)}{job.prompt.length > 60 ? '...' : ''}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(job.createdAt)}
                      </Badge>
                      {job.stylePreset && (
                        <Badge variant="info" className="text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {job.stylePreset}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {result && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDownload(result.url, job.id)}
                      className="hover:bg-purple-500/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700/50 group-hover:border-purple-500/30 transition-all">
                    <Image
                      src={result.url}
                      alt={job.prompt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <p className="text-sm text-slate-500">No preview available</p>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{job.tokensUsed} token{job.tokensUsed !== 1 ? 's' : ''} used</span>
                  {result && (
                    <span>{result.width} × {result.height}px</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHistory(pagination.page - 1)}
            disabled={pagination.page === 1 || isLoading}
            className="border-slate-700"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
            <span className="text-sm text-white">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchHistory(pagination.page + 1)}
            disabled={!pagination.hasMore || isLoading}
            className="border-slate-700"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
