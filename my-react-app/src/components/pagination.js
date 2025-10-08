import React, { useState } from 'react';

const items = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    const totalPages = Math.ceil(items.length / itemsPerPage)

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page)
    }

    const getPageNumbers = () => {
        const pages = [];
        const startBlock = 4;      // show 1..4 when near the start
        const endBlock = 4;        // show last 4 when near the end
        const edgeCount = 2;       // always keep 1,2 and last-1,last in middle state
        const sibling = 1;         // how many neighbors around current in middle

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // 1) Near the start: 1 2 3 4 … 9 10
        if (currentPage <= startBlock) {
            for (let i = 1; i <= startBlock; i++) pages.push(i);
            pages.push("...");
            for (let i = totalPages - (edgeCount - 1); i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // 2) Near the end: 1 2 … (N-3) (N-2) (N-1) N
        if (currentPage >= totalPages - endBlock + 1) {
            for (let i = 1; i <= edgeCount; i++) pages.push(i);
            pages.push("...");
            for (let i = totalPages - endBlock + 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        // 3) Middle pages: 1 2 … (p-1) p (p+1) … (N-1) N
        const left = Math.max(currentPage - sibling, edgeCount + 1);
        const right = Math.min(currentPage + sibling, totalPages - edgeCount);

        // left edge
        for (let i = 1; i <= edgeCount; i++) pages.push(i);
        pages.push("...");

        // window around current
        for (let i = left; i <= right; i++) pages.push(i);

        // right edge
        pages.push("...");
        for (let i = totalPages - edgeCount + 1; i <= totalPages; i++) pages.push(i);

        return pages;
        };

    return (
     <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">React + Tailwind Pagination Demo</h1>

      <ul className="w-full max-w-md bg-white shadow-md rounded-2xl divide-y divide-gray-200">
        {currentItems.map((item, idx) => (
          <li key={idx} className="p-4 hover:bg-gray-100 transition">
            {item}
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 mt-6">
        <button
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {getPageNumbers().map((page, index) => {
            const key = typeof page === "number" ? `page-${page}` : `ellipsis-${index}`;
            return page === "..." ? (
                <span key={key} className="px-2 text-gray-500">…</span>
            ) : (
                <button
                key={key}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-lg ${
                    currentPage === page ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
                >
                {page}
                </button>
            );
        })}

        <button
          className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;