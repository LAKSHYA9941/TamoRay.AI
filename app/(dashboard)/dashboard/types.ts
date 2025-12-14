// Type definitions for Planning and Generation features

export interface PlanRequest {
  prompt: string;
  uploadedImages?: string[];
  options?: {
    researchDepth?: 'basic' | 'detailed' | 'comprehensive';
    maxSources?: number;
    includeWebSearch?: boolean;
  };
}

export interface WebSearchResult {
  title: string;
  url: string;
  snippet: string;
  relevance?: number;
}

export interface PlanningStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  sources?: WebSearchResult[];
  timestamp: string;
}

export interface PlanResponse {
  id: string;
  prompt: string;
  steps: PlanningStep[];
  summary: string;
  sources: WebSearchResult[];
  createdAt: string;
  status: 'planning' | 'completed' | 'error';
  error?: string;
}

export interface GenerateRequest {
  prompt: string;
  style?: string;
  uploadedImages?: string[];
  options?: {
    aspectRatio?: '16:9' | '4:3' | '1:1';
    quality?: 'standard' | 'hd';
    numberOfVariations?: number;
  };
}

export enum GenerationStatus {
  IDLE = 'idle',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface GeneratedThumbnail {
  id: string;
  url: string;
  prompt: string;
  style?: string;
  metadata?: {
    width: number;
    height: number;
    format: string;
  };
}

export interface GenerateResponse {
  id: string;
  status: GenerationStatus;
  thumbnails: GeneratedThumbnail[];
  progress?: number;
  error?: string;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
