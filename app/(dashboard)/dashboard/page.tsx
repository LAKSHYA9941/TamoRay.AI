// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Image as ImageIcon, ArrowUp, Search } from 'lucide-react';
import { TabNavigation } from '@/components/dashboard/TabNavigation';
import { GenerateContent } from '@/app/(dashboard)/dashboard/GenerateContent';
import { PlanContent } from '@/app/(dashboard)/dashboard/PlanContent';
import { usePlanning } from '@/app/(dashboard)/dashboard/hooks/usePlanning';
import { useGeneration } from '@/app/(dashboard)/dashboard/hooks/useGeneration';
import { Badge } from '@/components/ui/badge';

type Tab = 'generate' | 'plan';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [inputValue, setInputValue] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [includeWebSearch, setIncludeWebSearch] = useState(true);

  // Planning hook
  const planning = usePlanning();

  // Generation hook
  const generation = useGeneration();
  
  const handleSend = () => {
    if (!inputValue.trim()) return;

    if (activeTab === 'plan') {
      // Start planning
      planning.startPlanning({
        prompt: inputValue,
        options: {
          includeWebSearch,
          researchDepth: 'detailed',
        },
      });
    } else {
      // Start generation
      generation.startGeneration({
        prompt: inputValue,
        style: selectedStyle,
        options: {
          aspectRatio: '16:9',
          quality: 'hd',
          numberOfVariations: 1,
        },
      });
    }

    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isLoading = activeTab === 'plan' ? planning.isPlanning : generation.isGenerating;

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          {activeTab === 'generate' ? (
            <GenerateContent
              generationState={generation}
              selectedStyle={selectedStyle}
              onStyleChange={setSelectedStyle}
            />
          ) : (
            <PlanContent
              planningState={planning}
              includeWebSearch={includeWebSearch}
            />
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          {/* Options Row */}
          <div className="flex items-center gap-2 mb-3">
            {activeTab === 'plan' && (
              <button
                type="button"
                onClick={() => setIncludeWebSearch(!includeWebSearch)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all ${includeWebSearch
                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400'
                  }`}
                disabled={isLoading}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Web Search</span>
                {includeWebSearch && (
                  <Badge variant="info" className="ml-1 text-xs px-1.5 py-0">ON</Badge>
                )}
              </button>
            )}

            {activeTab === 'generate' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Style:</span>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                >
                  <option value="modern">✨ Modern</option>
                  <option value="minimalist">⚪ Minimalist</option>
                  <option value="vibrant">🌈 Vibrant</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="professional">💼 Professional</option>
                  <option value="playful">🎨 Playful</option>
                </select>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <button className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              placeholder={
                activeTab === 'generate' 
                  ? "Describe your thumbnail..." 
                  : "What would you like to plan?"
              }
              className={`w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl
                       text-white placeholder-slate-500 focus:outline-none focus:ring-2
                       ${activeTab === 'plan' ? 'focus:ring-blue-400/50' : 'focus:ring-amber-400/50'} 
                       focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed`}
            />

            <button 
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                inputValue.trim() && !isLoading
                  ? activeTab === 'plan'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-amber-400 text-slate-900 hover:bg-amber-300'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 mt-3">
            {activeTab === 'generate'
              ? "Tamoray may produce inaccurate information about people, places, or facts."
              : "Plans are automatically saved and can be accessed anytime."}
          </p>
        </div>
      </div>
    </div>
  );
}