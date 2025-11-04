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
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-sm">
            <FaPlus />
            <span>Add new</span>
          </button>
        </div>
      </div>
    </div>
  );
}