import React from 'react';
import { FaPlus } from 'react-icons/fa';

export default function HeaderTabs({ title = 'Employee Management', active = 'team', onTabChange }) {
  // debug: confirm component mounts in the browser console
  // Remove this console.log once visibility issues are resolved
  console.log('HeaderTabs rendered');

  return (
    <div className="bg-white border-b-4 border-red-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
          <nav className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
            <button className={`pb-2 ${active === 'team' ? 'text-indigo-600 font-medium border-b-2 border-indigo-600' : ''}`} onClick={() => onTabChange?.('team')} aria-current={active === 'team' ? 'page' : undefined}>Team members</button>
            <button className={`pb-2 ${active === 'payroll' ? 'text-indigo-600 font-medium border-b-2 border-indigo-600' : ''}`} onClick={() => onTabChange?.('payroll')} aria-current={active === 'payroll' ? 'page' : undefined}>Payroll</button>
          </nav>
        </div>

        
      </div>
    </div>
  );
}