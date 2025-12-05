// app/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Image as ImageIcon, ArrowUp } from 'lucide-react';
import { TabNavigation } from '@/components/dashboard/TabNavigation';
import { GenerateContent } from '@/app/(dashboard)/dashboard/GenerateContent';
import { PlanContent } from '@/app/(dashboard)/dashboard/PlanContent';

type Tab = 'generate' | 'plan';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('generate');
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    // Handle send message logic here
    console.log(`[${activeTab}] Sending:`, inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
          {activeTab === 'generate' ? <GenerateContent /> : <PlanContent />}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-800">
        <div className="max-w-3xl mx-auto">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
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
              placeholder={
                activeTab === 'generate' 
                  ? "Describe your thumbnail..." 
                  : "What would you like to plan?"
              }
              className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-700 rounded-xl
                       text-white placeholder-slate-500 focus:outline-none focus:ring-2
                       focus:ring-amber-400/50 focus:border-transparent"
            />

            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                inputValue.trim()
                  ? 'bg-amber-400 text-slate-900 hover:bg-amber-300'
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