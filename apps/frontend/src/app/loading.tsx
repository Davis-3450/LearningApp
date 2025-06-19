import { Loader } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="flex items-center gap-2">
        <Loader className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
        <span className="text-gray-600 dark:text-gray-400">Loading...</span>
      </div>
    </div>
  );
}