import { Skeleton } from '@/components/ui/skeleton';
import React, { useState, useEffect } from 'react';

const UserPreviewCount = ({ count }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (count !== undefined) {
      setLoading(false);
    }
  }, [count]);

  return (
    <div className="p-4">
      {loading ? (
        // Show Skeleton when data is loading
        <Skeleton className="w-full h-24 bg-gray-300 dark:bg-gray-700 animate-pulse rounded-lg" />
      ) : (
        <div className="flex justify-center items-center">
          <div
            className="w-60 p-6 bg-[#161212] dark:bg-gray-700 rounded-lg shadow-xl transform transition-all duration-500 hover:scale-105 hover:shadow-2xl opacity-100 transition-opacity ease-in-out"
            style={{ opacity: loading ? 0 : 1 }}
          >
            <div className="text-center text-gray-900 dark:text-gray-100">
              <h2 className="text-4xl font-extrabold text-white">{count}</h2>
              <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">User Previews</p>
            </div>
            {/* Optional progress bar */}
            <div className="mt-4 h-1 w-full bg-gray-400 dark:bg-gray-600 rounded-full">
              <div className="h-full bg-gray-500 dark:bg-gray-400" style={{ width: `${(count % 100)}%` }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPreviewCount;
