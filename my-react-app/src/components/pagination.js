// import React, { useState } from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

// const items = Array.from({ length: 95 }, (_, i) => `Item ${i + 1}`);

// const Pagination = () => {
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;
    
//     const totalPages = Math.ceil(items.length / itemsPerPage)

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

//     const goToPage = (page) => {
//         if (page < 1 || page > totalPages) return;
//         setCurrentPage(page)
//     }

//     const getPageNumbers = () => {
//         const pages = [];
//         const startBlock = 4;      // show 1..4 when near the start
//         const endBlock = 4;        // show last 4 when near the end
//         const edgeCount = 2;       // always keep 1,2 and last-1,last in middle state
//         const sibling = 1;         // how many neighbors around current in middle

//         if (totalPages <= 7) {
//             for (let i = 1; i <= totalPages; i++) pages.push(i);
//             return pages;
//         }

//         if (currentPage <= startBlock) {
//             for (let i = 1; i <= startBlock; i++) pages.push(i);
//             pages.push("...");
//             for (let i = totalPages - (edgeCount - 1); i <= totalPages; i++) pages.push(i);
//             return pages;
//         }

//         if (currentPage >= totalPages - endBlock + 1) {
//             for (let i = 1; i <= edgeCount; i++) pages.push(i);
//             pages.push("...");
//             for (let i = totalPages - endBlock + 1; i <= totalPages; i++) pages.push(i);
//             return pages;
//         }

//         const left = Math.max(currentPage - sibling, edgeCount + 1);
//         const right = Math.min(currentPage + sibling, totalPages - edgeCount);

//         for (let i = 1; i <= edgeCount; i++) pages.push(i);
//         pages.push("...");

//         for (let i = left; i <= right; i++) pages.push(i);

//         pages.push("...");
//         for (let i = totalPages - edgeCount + 1; i <= totalPages; i++) pages.push(i);

//         return pages;
//         };

//     return (
//      <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">

//       <ul className="w-full max-w-md bg-white shadow-md rounded-2xl divide-y divide-gray-200">
//         {currentItems.map((item, idx) => (
//           <li key={idx} className="p-4 hover:bg-gray-100 transition">
//             {item}
//           </li>
//         ))}
//       </ul>

//       <div className="flex items-center gap-2 mt-6">
//         <button
//           className="px-3 py-1 rounded-lg disabled:opacity-40"
//           onClick={() => goToPage(currentPage - 1)}
//           disabled={currentPage === 1}
//         >
//           <ChevronLeftIcon className="h-5 w-5" />
//         </button>

//         {getPageNumbers().map((page, index) => {
//             const key = typeof page === "number" ? `page-${page}` : `ellipsis-${index}`;
//             return page === "..." ? (
//                 <button key={key} className="px-3 py-1 rounded-lg bg-gray-100 ">…</button>
//             ) : (
//                 <button
//                 key={key}
//                 onClick={() => goToPage(page)}
//                 className={`px-3 py-1 rounded-lg ${
//                     currentPage === page ? "bg-orange-600 text-white" : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//                 >
//                 {page}
//                 </button>
//             );
//         })}

//         <button
//           className="px-3 py-1 rounded-lg disabled:opacity-40"
//           onClick={() => goToPage(currentPage + 1)}
//           disabled={currentPage === totalPages}
//         >
//           <ChevronRightIcon className="h-5 w-5" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Pagination;


import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

const items = Array.from({ length: 95 }, (_, i) => `Item ${i + 1}`);

const Pagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // --- Compact pager: 1 … (current±sibling) … last ---
  function getPageNumbers({
    totalPages,
    currentPage,
    siblingCount = 1, // show current-1, current, current+1
    boundaryCount = 1 // only show 1 and last
  }) {
    // Small page counts: show all
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const first = 1;
    const last = totalPages;

    const left = Math.max(currentPage - siblingCount, first + boundaryCount);
    const right = Math.min(currentPage + siblingCount, last - boundaryCount);

    const pages = [];

    // Left boundary
    for (let i = 0; i < boundaryCount; i++) pages.push(first + i);

    // Left dots
    if (left > first + boundaryCount) pages.push("…");

    // Middle window
    for (let p = left; p <= right; p++) pages.push(p);

    // Right dots
    if (right < last - boundaryCount) pages.push("…");

    // Right boundary
    for (let i = boundaryCount - 1; i >= 0; i--) pages.push(last - i);

    // De-duplicate if ranges touched (e.g., when current near edges)
    const compact = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] === pages[i - 1]) continue;        // drop duplicate numbers
      if (pages[i] === "…" && compact[compact.length - 1] === "…") continue; // drop double dots
      compact.push(pages[i]);
    }
    return compact;
  }

  const pages = getPageNumbers({ totalPages, currentPage, siblingCount: 1, boundaryCount: 1 });

  const baseBtn =
    "inline-flex items-center justify-center h-10 min-w-10 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition";
  const activeBtn =
    "inline-flex items-center justify-center h-10 min-w-10 rounded-xl bg-orange-600 text-white shadow";

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10 px-4">
      <ul className="w-full max-w-md bg-white shadow-md rounded-2xl divide-y divide-gray-200">
        {currentItems.map((item) => (
          <li key={item} className="p-4 hover:bg-gray-100 transition">
            {item}
          </li>
        ))}
      </ul>

      <nav className="flex items-center gap-2 mt-6" aria-label="Pagination">
        <button
          className={`${baseBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-3 text-gray-400 select-none">…</span>
          ) : (
            <button
              key={`page-${p}`}
              onClick={() => goToPage(p)}
              className={currentPage === p ? activeBtn : baseBtn}
              aria-current={currentPage === p ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        <button
          className={`${baseBtn} disabled:opacity-40 disabled:cursor-not-allowed`}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
