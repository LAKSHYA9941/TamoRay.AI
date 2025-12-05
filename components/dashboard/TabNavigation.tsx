'use client';

import { useState } from 'react';
import { FileText, ListChecks } from 'lucide-react';

type Tab = 'generate' | 'plan';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 mb-2 px-1">
      <button
        onClick={() => onTabChange('generate')}
        className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
          activeTab === 'generate'
            ? 'bg-slate-700 text-amber-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <FileText className="w-4 h-4 mr-1.5" />
        Generate
      </button>
      <button
        onClick={() => onTabChange('plan')}
        className={`flex items-center px-3 py-1.5 text-sm rounded-md transition-colors ${
          activeTab === 'plan'
            ? 'bg-slate-700 text-amber-400'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
        }`}
      >
        <ListChecks className="w-4 h-4 mr-1.5" />
        Plan
      </button>
    </div>
  );
}
