'use client';

import { Coins, Sparkles, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function TokenDisplay() {
  const [tokens, setTokens] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTokenBalance();
  }, []);

  const fetchTokenBalance = async () => {
    try {
      const response = await fetch('/api/tokens/balance');
      if (response.ok) {
        const data = await response.json();
        setTokens(data.tokens);
        setPlan(data.plan);
      }
    } catch (error) {
      console.error('Failed to fetch token balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700 animate-pulse">
        <div className="w-16 h-4 bg-slate-700 rounded"></div>
      </div>
    );
  }

  const isPro = plan !== 'free';
  const isLowTokens = tokens !== null && tokens < 3;

  return (
    <div className="flex items-center gap-2">
      {/* Token Balance */}
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
        isLowTokens
          ? 'bg-red-500/10 border-red-500/50 text-red-400'
          : 'bg-amber-500/10 border-amber-500/50 text-amber-400'
      }`}>
        <Coins className="w-4 h-4" />
        <span className="text-sm font-semibold">
          {tokens !== null ? tokens : '—'}
        </span>
        <span className="text-xs opacity-75">tokens</span>
      </div>

      {/* Plan Badge */}
      {isPro && (
        <Badge 
          variant="warning" 
          className="flex items-center gap-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50"
        >
          <Crown className="w-3 h-3" />
          <span className="text-xs font-semibold uppercase">{plan}</span>
        </Badge>
      )}
    </div>
  );
}
