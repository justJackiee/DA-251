import {UserX} from 'lucide-react';

export default function TodayAbsent() {
    return (
    <div className="bg-white rounded-xl shadow p-5 w-48 leading-tight">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
            Today Absent
            </h2>
            <UserX className="w-4 h-4 text-indigo-900"/>
        </div>
        <div className="flex items-end font-bold gap-1 mt-2 ">
            <h2 className="text-4xl text-gray-800">0</h2>
        </div>
    </div>
  );
}
