import {UserCheck} from 'lucide-react';

export default function TodayPresent() {
    return (
      <div className="bg-white rounded-xl shadow p-5 w-48 leading-tight">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">
          Today Present
          </h2>
          <UserCheck className="w-4 h-4 text-indigo-900"/>
        </div>
        <div className="flex items-end font-bold gap-1 mt-2">
            <h2 className="text-4xl text-gray-800">18</h2>
        </div>
      </div>
  );
} 
