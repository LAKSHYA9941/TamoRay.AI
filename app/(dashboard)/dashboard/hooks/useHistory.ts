'use client';

import { useState, useEffect, useCallback } from 'react';

interface HistoryJob {
  id: string;
  prompt: string;
  stylePreset: string | null;
  results: any;
  createdAt: string;
  completedAt: string | null;
  tokensUsed: number;
}

interface HistoryPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}

interface UseHistoryReturn {
  jobs: HistoryJob[];
  pagination: HistoryPagination | null;
  isLoading: boolean;
  error: string | null;
  fetchHistory: (page?: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [jobs, setJobs] = useState<HistoryJob[]>([]);
  const [pagination, setPagination] = useState<HistoryPagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/history?page=${page}&limit=20`);

      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('History fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchHistory(pagination?.page || 1);
  }, [fetchHistory, pagination?.page]);

  // Initial fetch
  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  return {
    jobs,
    pagination,
    isLoading,
    error,
    fetchHistory,
    refresh,
  };
}
