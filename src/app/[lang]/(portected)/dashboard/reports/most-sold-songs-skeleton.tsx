import React from "react";
import Skeleton from "./skeleton";

const MostSoldSongsSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <Skeleton className="h-8 w-1/4 mb-4" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-4 w-4 mr-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostSoldSongsSkeleton;
