import React from "react";
import dayjs from "dayjs";

export default function TimeTrackingTable({ rows, days }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-scroll">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr className="text-gray-500 text-xs uppercase">
            <th className="p-3 text-left">Employee Name</th>
            <th className="p-3 text-left">Type</th>
            <th className="p-3 text-left">Total Hours</th>
            <th className="p-3 text-left">Overtime</th>

            {days.map((d) => (
              <th key={d} className="p-3 text-center">
                {dayjs(d).format("D MMM")}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">
              <td className="p-3 font-medium">{row.employeeName}</td>
              <td className="p-3">
                <span className="inline-block bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs font-medium">
                  {row.employeeType === 'Fulltime' ? 'Full time' : row.employeeType}
                </span>
              </td>
              <td className="p-3">{row.totalHours ? row.totalHours.toFixed(1) : '0'} h</td>
              <td className="p-3">{row.totalOvertime ? row.totalOvertime.toFixed(1) : '0'} h</td>

              {days.map((d) => (
                <td key={d} className="p-3 text-center">{row.days[d]}</td>
              ))}

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
