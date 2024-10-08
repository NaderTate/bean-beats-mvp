import React from "react";
import Skeleton from "./skeleton";

const SalesTrendSkeleton: React.FC = () => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-8 w-1/4" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
};

export default SalesTrendSkeleton;
