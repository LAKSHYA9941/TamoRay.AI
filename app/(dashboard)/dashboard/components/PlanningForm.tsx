'use client';

import { useState } from 'react';
import { Sparkles, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PlanningFormProps {
  onSubmit: (prompt: string, includeWebSearch: boolean) => void;
  isLoading: boolean;
}

export function PlanningForm({ onSubmit, isLoading }: PlanningFormProps) {
  const [prompt, setPrompt] = useState('');
  const [includeWebSearch, setIncludeWebSearch] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt, includeWebSearch);
    }
  };

  const charCount = prompt.length;
  const maxChars = 500;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to plan... (e.g., 'Plan a YouTube thumbnail for a cooking video about Italian pasta')"
          className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none focus:ring-2 focus:ring-blue-400/50"
          maxLength={maxChars}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={`${charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => setIncludeWebSearch(!includeWebSearch)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
            includeWebSearch
              ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
              : 'bg-slate-800/50 border-slate-700 text-slate-400'
          }`}
          disabled={isLoading}
        >
          <Search className="w-4 h-4" />
          <span className="text-sm">Web Search</span>
          {includeWebSearch && (
            <Badge variant="info" className="ml-1">ON</Badge>
          )}
        </button>

        <Button
          type="submit"
          disabled={!prompt.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {isLoading ? 'Planning...' : 'Create Plan'}
        </Button>
      </div>
    </form>
  );
}
