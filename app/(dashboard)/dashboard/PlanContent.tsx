import { ListChecks } from 'lucide-react';

export function PlanContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 p-6 bg-slate-800/50 rounded-full">
        <ListChecks className="w-12 h-12 text-blue-400" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-white">Plan Your Content</h1>
      <p className="text-xl text-slate-300 max-w-md">
        Let's plan and organize your thumbnail ideas effectively.
      </p>
    </div>
  );
}
