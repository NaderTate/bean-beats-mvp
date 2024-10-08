import React from "react";
import Skeleton from "./skeleton";

const PeakTimesSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {[...Array(24)].map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton className="h-20 w-full mb-1" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeakTimesSkeleton;
