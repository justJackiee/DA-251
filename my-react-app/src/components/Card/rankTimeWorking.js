// src/components/Card/rankTimeWorking.js
import { Trophy } from "lucide-react";

export default function RankTimeWorking({ employees }) {
  const sampleData = [
    { name: "John Doe", hours: 182 },
    { name: "Sarah Tran", hours: 174 },
    { name: "Michael Nguyen", hours: 165 },
    { name: "Emma Pham", hours: 158 },
    { name: "David Le", hours: 150 },
  ];

  const data = employees || sampleData;
  const sorted = [...data].sort((a, b) => b.hours - a.hours);

  return (
    <div className="bg-white rounded-xl shadow p-5 w-72 leading-tight">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Rank Time Working</h2>
        <Trophy className="text-yellow-500 w-5 h-5" />
      </div>
      <div className="space-y-3">
        {sorted.map((emp, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2 transition"
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold text-white ${
                  index === 0
                    ? "bg-yellow-500" 
                    : index === 1
                    ? "bg-gray-400"
                    : index === 2
                    ? "bg-amber-700"
                    : "bg-gray-300"
                }`}
              >
                {index + 1}
              </span>
              <span className="font-medium text-gray-700">{emp.name}</span>
            </div>
            <div className="text-sm text-gray-600 font-semibold">{emp.hours} hrs</div>
          </div>
        ))}
      </div>
    </div>
  );
}
