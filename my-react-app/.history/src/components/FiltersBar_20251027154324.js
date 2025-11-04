import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function FiltersBar({ search, onSearch, filters, onFilterChange, onClear }) {
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

        {/* Filters container: horizontally aligned on md+, stacked on xs */}
        <div className="flex w-full md:w-auto gap-3 items-center">
          <select
            value={filters.office || ''}
            onChange={(e) => onFilterChange?.('office', e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full md:w-56 min-w-0"
            style={{ direction: 'ltr' }}
          >
            <option value="">All Offices</option>
            <option>Mink</option>
            <option>Elevate Complex</option>
          </select>

          <select
            value={filters.department || ''}
            onChange={(e) => onFilterChange?.('department', e.target.value)}
            className="border rounded px-3 py-2 text-sm w-full md:w-56 min-w-0"
            style={{ direction: 'ltr' }}
          >
            <option value="">All Departments</option>
            <option>Production</option>
            <option>Marketing</option>
          </select>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          <button onClick={onClear} className="underline">Clear filters</button>
        </div>
      </div>
    </div>
  );
}