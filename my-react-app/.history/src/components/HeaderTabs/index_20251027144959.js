import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function HeaderTabs({ title = 'Employee Management', active = 'team', onTabChange }) {
  return (
    <div className="bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          </div>

          <div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm">
              <FaPlus />
              <span>Add new</span>
            </button>
          </div>
        </div>

        {/* centered tabs - positioned absolutely so they stay in the same line */}
        <nav className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-8 text-sm text-gray-500">
          <button
            className={`pb-3 ${active === 'team' ? 'text-indigo-600 font-medium border-b-4 border-indigo-600' : ''}`}
            onClick={() => onTabChange?.('team')}
            aria-current={active === 'team' ? 'page' : undefined}
          >
            Team members
          </button>

          <button
            className={`pb-3 ${active === 'payroll' ? 'text-indigo-600 font-medium border-b-4 border-indigo-600' : ''}`}
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