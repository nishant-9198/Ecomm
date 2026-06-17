import React, { useEffect, useRef } from "react";

const InfiniteScroll = ({ loadMore, hasMore, isLoading, children }) => {
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore, hasMore, isLoading]);

  return (
    <>
      {children}
      <div ref={observerTarget} className="h-10 w-full flex justify-center items-center mt-6">
        {isLoading && (
          <div className="flex space-x-1.5 justify-center items-center py-4">
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>
    </>
  );
};

export default InfiniteScroll;
