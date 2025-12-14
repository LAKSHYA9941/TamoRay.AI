'use client';

import { useEffect, useRef } from 'react';
import { Copy, CheckCircle2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PlanResponse, WebSearchResult } from '../types';
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
  const [editableText, setEditableText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize editable text when plan is received
  useEffect(() => {
    const text = streamingText || planResponse?.summary || '';
    if (text && !editableText) {
      setEditableText(text);
    } else if (streamingText) {
      setEditableText(streamingText);
    }
  }, [streamingText, planResponse]);

  // Auto-scroll during streaming
  useEffect(() => {
    if (textareaRef.current && isStreaming) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [editableText, isStreaming]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [editableText]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(editableText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };

  if (!editableText && !isStreaming) {
    return null;
  }

  return (
    <div className="space-y-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Chat-like message bubble */}
      <div className="flex gap-3 items-start">
        {/* AI Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-blue-400" />
        </div>

        {/* Message Content */}
        <div className="flex-1 max-w-2xl">
          {/* Compact Plan Card */}
          <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-blue-500/30 transition-all">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-400">
                  {isStreaming ? 'Generating plan...' : 'Your Plan'}
                </span>
                {!isStreaming && (
                  <Badge variant="info" className="text-xs">
                    Editable
                  </Badge>
                )}
              </div>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-slate-700/50 text-slate-400 hover:text-blue-400 transition-colors"
                title="Copy plan"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Editable Content */}
            <div className="p-4">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={editableText}
                  onChange={handleTextChange}
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setIsEditing(false)}
                  disabled={isStreaming}
                  className={`w-full min-h-[150px] p-3 bg-slate-800/30 border rounded-lg 
                             text-slate-200 text-sm leading-relaxed resize-none overflow-hidden
                             focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent
                             disabled:opacity-70 disabled:cursor-not-allowed
                             ${isEditing ? 'border-blue-400/50' : 'border-slate-700/30'}
                             transition-all duration-200`}
                  placeholder="Your plan will appear here..."
                  style={{
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit'
                  }}
                />
                {isStreaming && (
                  <span className="absolute bottom-3 right-3 w-2 h-4 bg-blue-400 animate-pulse rounded-sm" />
                )}
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
  );
}
