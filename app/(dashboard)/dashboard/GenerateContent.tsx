import { MessageSquare } from 'lucide-react';

export function GenerateContent() {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 p-6 bg-slate-800/50 rounded-full">
        <MessageSquare className="w-12 h-12 text-amber-400" />
      </div>
      <h1 className="text-4xl font-bold mb-4 text-white">Hello there!</h1>
      <p className="text-xl text-slate-300 max-w-md">
        How can I help you create amazing thumbnails today?
      </p>
    </div>
  );
}
