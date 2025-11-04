import React from "react";
import StatusBadge from "./StatusBadge";

const employees = [
  { name: "Ryan Walker", type: "Full time", total: "100h | 128h", overtime: "0h", status: "Approved" },
  { name: "Andrew Walker", type: "Full time", total: "120h | 128h", overtime: "0h", status: "Approved" },
  { name: "Brian Taylor", type: "Full time", total: "128h | 128h", overtime: "0h", status: "Approved" },
  { name: "Sarah Lee", type: "Contractor", total: "100h | 80h", overtime: "20h", status: "Pending" },
  { name: "Jennifer Scott", type: "Part time", total: "100h | 90h", overtime: "10h", status: "Pending" },
];

export default function TimeTrackingTable() {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
          <tr>
            <th className="p-3">Employee Name</th>
            <th className="p-3">Employee Type</th>
            <th className="p-3">Total Work Hours</th>
            <th className="p-3">Overtime</th>
            <th className="p-3">Status</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, i) => (
            <tr key={i} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium text-gray-800">{emp.name}</td>
              <td className="p-3 text-blue-600">{emp.type}</td>
              <td className="p-3">{emp.total}</td>
              <td className="p-3">{emp.overtime}</td>
              <td className="p-3">
                <StatusBadge status={emp.status} />
              </td>
              <td className="p-3 text-gray-500">⋮</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
