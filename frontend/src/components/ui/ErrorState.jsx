import React from "react";

const ErrorState = ({ 
  title = "Something went wrong", 
  description = "An error occurred while loading this data. Please try again.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-red-500/80 mb-4">
        <svg className="w-16 h-16 mx-auto stroke-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-light uppercase tracking-widest text-white/90 mb-2">{title}</h3>
      <p className="text-white/40 max-w-sm mx-auto text-xs leading-relaxed mb-6">{description}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-yellow-400 text-black text-xs font-semibold uppercase tracking-widest rounded-md hover:bg-yellow-500 transition shadow-[0_0_15px_rgba(250,204,21,0.2)]"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState;
