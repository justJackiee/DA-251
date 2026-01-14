import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaSearch } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


export default function FiltersBar({ search, onSearch, filters, onFilterChange, onClear }) {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
   const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e) {
      // if click is inside popup, ignore
      if (popupRef.current && popupRef.current.contains(e.target)) return;
      // if click is the filter button, ignore here (button toggles open)
      if (buttonRef.current && buttonRef.current.contains(e.target)) return;
      setOpen(false);
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

  // compute popup position anchored to button
  useEffect(() => {
    function updatePos() {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
    if (open) {
      updatePos();
      window.addEventListener('resize', updatePos);
      window.addEventListener('scroll', updatePos, true);
    }
    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
    };
  }, [open]);

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
            ref={buttonRef}
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded text-sm hover:shadow"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            Filters
          </button>

          {open && popupRef && createPortal(
            <div
              ref={popupRef}
              className="bg-white border rounded shadow-lg z-50 p-3"
              style={{ position: 'absolute', top: popupPos.top + 'px', left: popupPos.left + 'px', width: 256 }}
            >
              <div className="space-y-2">
                <label className="block text-xs text-gray-500">Position</label>
                <select
                  value={filters.position || ''}
                  onChange={(e) => onFilterChange?.('position', e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">All Positions</option>
                  <option>PM Coop.</option>
                  <option>Elevate Complex</option>
                </select>

                <label className="block text-xs text-gray-500">Sex</label>
                <select
                  value={filters.sex || ''}
                  onChange={(e) => onFilterChange?.('sex', e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">All Sexes</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <label className="block text-xs text-gray-500">Type</label>
                <select
                  value={filters.type || ''}
                  onChange={(e) => onFilterChange?.('type', e.target.value)}
                  className="border rounded px-3 py-2 text-sm w-full"
                >
                  <option value="">All Types</option>
                  <option>HR</option>
                  <option>Freelance</option>
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
            </div>,
            // render portal into body so it won't be clipped by parent overflow
            typeof document !== 'undefined' ? document.body : null
          )}
        </div>
        <button
          onClick={() => navigate('/employees/new')}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm"
          aria-label="Add new"
        >
          <FaPlus />
          <span className="hidden sm:inline">Add new</span>
        </button>
      </div>
    </div>
  );
}