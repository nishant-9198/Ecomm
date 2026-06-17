import React from "react";

const Pagination = ({ 
  page, 
  totalPages, 
  onPageChange,
  hasNextPage,
  hasPreviousPage
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers range (e.g. max 5 around active page)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 py-8 select-none">
      {/* Previous Button */}
      <button
        onClick={() => hasPreviousPage && onPageChange(page - 1)}
        disabled={!hasPreviousPage}
        className={`px-3 py-2 text-xs uppercase tracking-wider rounded-md border transition cursor-pointer ${
          hasPreviousPage
            ? "bg-transparent text-white border-white/10 hover:border-yellow-400 hover:text-yellow-400"
            : "bg-transparent text-white/20 border-white/5 cursor-not-allowed"
        }`}
      >
        Prev
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-xs rounded-md border transition font-medium cursor-pointer ${
            page === p
              ? "bg-yellow-400 text-black border-yellow-400 font-semibold shadow-[0_0_10px_rgba(250,204,21,0.3)]"
              : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => hasNextPage && onPageChange(page + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-2 text-xs uppercase tracking-wider rounded-md border transition cursor-pointer ${
          hasNextPage
            ? "bg-transparent text-white border-white/10 hover:border-yellow-400 hover:text-yellow-400"
            : "bg-transparent text-white/20 border-white/5 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
