import { Trophy } from "lucide-react";

export default function LateCheckinRanking() {
  const lateEmployees = [
    { id: 1, name: "Anna Tran", times: 8 },
    { id: 2, name: "Kevin Pham", times: 6 },
    { id: 3, name: "Lisa Nguyen", times: 5 },
    { id: 4, name: "Tom Le", times: 4 },
    { id: 5, name: "Nina Vo", times: 3 },
  ];

  const rankColors = ["bg-yellow-400", "bg-gray-300", "bg-orange-400"];

  return (
    <div className="bg-white rounded-xl shadow p-5 w-72 leading-tight">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Late Check-in Ranking
        </h2>
        <Trophy className="w-5 h-5" />
      </div>

      <ul className="space-y-3">
        {lateEmployees.map((emp, index) => (
          <li
            key={emp.id}
            className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-2 transition"
          >
            <div className="flex items-center gap-3">
              <div
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
              </div>
              <span className="font-medium text-gray-800">{emp.name}</span>
            </div>
            <span className="text-gray-600 text-sm">{emp.times} times</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
