import React from "react";

const SkeletonCard = () => {
  return (
    <div className="relative bg-white w-full rounded-xl border border-gray-200 p-3 flex flex-col animate-pulse">
      {/* IMAGE PLACEHOLDER */}
      <div className="h-44 bg-gray-200 rounded-md overflow-hidden" />

      {/* CONTENT PLACEHOLDER */}
      <div className="flex flex-col flex-grow mt-2 space-y-2">
        {/* Title placeholder */}
        <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        
        {/* Description placeholders */}
        <div className="space-y-1">
          <div className="h-3 bg-gray-200 rounded-md w-full" />
          <div className="h-3 bg-gray-200 rounded-md w-5/6" />
        </div>

        {/* Price + Button placeholder */}
        <div className="mt-auto flex justify-between items-center pt-3">
          <div className="h-4 bg-gray-200 rounded-md w-1/4" />
          <div className="h-8 bg-gray-200 rounded-md w-1/3" />
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = ({ count = 4, className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" }) => {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
export { SkeletonCard };
