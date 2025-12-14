'use client';

import { HistoryContent } from '@/app/(dashboard)/dashboard/HistoryContent';
import { useHistory } from '@/app/(dashboard)/dashboard/hooks/useHistory';

export default function HistoryPage() {
  const history = useHistory();

  return (
    <div className="flex flex-col h-full">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-auto">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
          <HistoryContent historyState={history} />
        </div>
      </div>
    </div>
  );
}