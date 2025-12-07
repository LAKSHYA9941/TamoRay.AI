'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface GenerationFormProps {
  onSubmit: (prompt: string, style?: string) => void;
  isLoading: boolean;
}

const STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern', emoji: '✨' },
  { value: 'minimalist', label: 'Minimalist', emoji: '⚪' },
  { value: 'vibrant', label: 'Vibrant', emoji: '🌈' },
  { value: 'dark', label: 'Dark', emoji: '🌙' },
  { value: 'professional', label: 'Professional', emoji: '💼' },
  { value: 'playful', label: 'Playful', emoji: '🎨' },
];

export function GenerationForm({ onSubmit, isLoading }: GenerationFormProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt, selectedStyle);
    }
  };

  const charCount = prompt.length;
  const maxChars = 300;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Describe your thumbnail
        </label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the thumbnail you want to generate... (e.g., 'A cooking thumbnail with pasta and fresh ingredients')"
          className="min-h-[100px] bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 resize-none focus:ring-2 focus:ring-amber-400/50"
          maxLength={maxChars}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between text-xs">
          <span className={`${charCount > maxChars * 0.9 ? 'text-amber-400' : 'text-slate-500'}`}>
            {charCount} / {maxChars}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {STYLE_OPTIONS.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setSelectedStyle(style.value)}
              disabled={isLoading}
              className={`p-3 rounded-lg border transition-all ${
                selectedStyle === style.value
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
              }`}
            >
              <span className="text-xl mb-1 block">{style.emoji}</span>
              <span className="text-xs font-medium">{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!prompt.trim() || isLoading}
        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isLoading ? 'Generating...' : 'Generate Thumbnail'}
      </Button>
    </form>
  );
}
