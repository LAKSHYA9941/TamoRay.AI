'use client';

import { FileText, ListChecks, History } from 'lucide-react';

type Tab = 'generate' | 'plan' | 'history';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'generate' as const, label: 'Generate', icon: FileText, color: 'amber' },
    { id: 'plan' as const, label: 'Plan', icon: ListChecks, color: 'blue' },
    { id: 'history' as const, label: 'History', icon: History, color: 'purple' },
  ];

  return (
    <div className="flex gap-1 border-b border-slate-800/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all relative ${isActive
                ? `text-${tab.color}-400 bg-slate-900/50`
                : 'text-slate-400 hover:bg-slate-900/30 hover:text-slate-200'
              }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-${tab.color}-400`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
