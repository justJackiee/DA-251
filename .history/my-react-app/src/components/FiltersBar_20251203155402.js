import React, { useState, useRef, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

export default function FiltersBar({ search, onSearch, filters, onFilterChange, onClear }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!popupRef.current) return;
      if (!popupRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white p-4 rounded-md shadow-sm flex flex-col md:flex-row md:items-center gap-3 overflow-visible relative z-50">
        {/* Search: flexible on larger screens, full width on small */}
        <div className="flex items-center w-full md:w-1/3 bg-gray-100 rounded-md px-3 py-2 min-w-0">
          <FaSearch className="text-gray-400 mr-2 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            className="bg-transparent flex-1 outline-none text-sm min-w-0"
            placeholder="Search by name, job title..."
            aria-label="Search employees"
          />
        </div>

        {/* Filter button that opens a popup with filter controls */}
        <div className="relative ml-3">
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm hover:shadow"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Filters
          </button>

          {open && (
            <div ref={popupRef} className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-3">
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Office</label>
                <select
                  value={filters.office || ''}
                  onChange={(e) => onFilterChange?.('office', e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">All Offices</option>
                  <option>PM Coop.</option>
                  <option>Elevate Complex</option>
                </select>

                <label className="block text-xs text-gray-500">Department</label>
                <select
                  value={filters.department || ''}
                  onChange={(e) => onFilterChange?.('department', e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">All Departments</option>
                  <option>Production</option>
                  <option>Marketing</option>
                </select>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => { onClear?.(); setOpen(false); }}
                    className="text-sm text-gray-600 underline"
                  >
                    Clear filters
                  </button>
                  <button
                    onClick={() => setOpen(false)}
                    className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}