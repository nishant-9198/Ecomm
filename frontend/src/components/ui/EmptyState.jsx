import React from "react";

const EmptyState = ({ 
  title = "No results found", 
  description = "Try adjusting your search filters or check back later." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-gray-600 mb-4">
        <svg className="w-16 h-16 mx-auto stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 className="text-lg font-light uppercase tracking-widest text-white/90 mb-2">{title}</h3>
      <p className="text-white/40 max-w-sm mx-auto text-xs leading-relaxed">{description}</p>
    </div>
  );
};

export default EmptyState;
