import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function HeaderTabs({ title = 'Employee Management', active = 'team', onTabChange }) {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* top row: title left, add button right (on mobile show icon only) */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">{title}</h1>

          <button
            className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm text-sm"
            aria-label="Add new"
          >
            <FaPlus />
            <span className="hidden sm:inline">Add new</span>
          </button>
        </div>

        {/* tabs: centered, larger touch targets on mobile */}
        <nav className="mt-3 md:mt-4 flex justify-center space-x-6 text-sm text-gray-500">
          <button
            className={`px-3 py-2 ${active === 'team' ? 'text-indigo-600 font-medium border-b-4 border-indigo-600' : 'hover:text-indigo-600'}`}
            onClick={() => onTabChange?.('team')}
            aria-current={active === 'team' ? 'page' : undefined}
          >
            Team members
          </button>

          <button
            className={`px-3 py-2 ${active === 'payroll' ? 'text-indigo-600 font-medium border-b-4 border-indigo-600' : 'hover:text-indigo-600'}`}
            onClick={() => onTabChange?.('payroll')}
            aria-current={active === 'payroll' ? 'page' : undefined}
          >
            Payroll
          </button>
        </nav>
      </div>
    </div>
  );
}
 