import React from "react";

function FreelanceContractTable({
  data = [],
  columns = null,
  title = "Freelance Contract List",
  showActions = true,
  onEdit = null
}) {
  const contracts = data;

  // CỘT MẶC ĐỊNH CHO FREELANCE CONTRACT (giống style FullTime)
  const defaultColumns = [
    { header: "Contract ID", accessor: "contract_id" },
    { header: "Employee ID", accessor: "employee_id" },
    { header: "Start Date", accessor: "start_date" },
    { header: "End Date", accessor: "end_date" },

    {
      header: "Value",
      render: (row) => `${Number(row.value || 0).toLocaleString()} VND`
    },
    {
      header: "Committed Deadline",
      accessor: "committed_deadline"
    },
    {
      header: "Status",
      render: (row) => {
        const cls = row.status === "Active"
          ? "bg-green-100 text-green-700"
          : row.status === "Expired"
          ? "bg-red-100 text-red-700"
          : "bg-gray-100 text-gray-700";
        return (
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${cls}`}>
            {row.status}
          </span>
        );
      }
    }
  ];

  const tableColumns = columns || defaultColumns;

  const handleEdit = (item) => {
    if (onEdit) return onEdit(item);
    window.location.href = `/contracts/freelance/${item.contract_id}`;
  };

  const handleView = (item) => {
    handleEdit(item);
  };

  return (
    <div className="flex justify-center mt-4">
      <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white text-center py-4 font-semibold text-xl">
          {title}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                {tableColumns.map((col, index) => (
                  <th key={index} className="py-3 px-4 text-left font-semibold border-b text-sm">
                    {col.header}
                  </th>
                ))}
                {showActions && <th className="py-3 px-4 text-left font-semibold border-b text-sm">Action</th>}
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + (showActions ? 1 : 0)} className="py-8 text-center text-gray-400">
                    No contracts found
                  </td>
                </tr>
              ) : (
                contracts.map((item, rowIndex) => (
                  <tr key={item.contract_id || rowIndex} className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex} className="py-3 px-4 text-left border-b text-sm">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                    
                    {showActions && (
                      <td className="py-3 px-4 text-left border-b text-sm">
                        <div className="inline-block">
                          <button
                            onClick={() => handleView(item)}
                            className="px-3 py-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600 text-sm font-medium"
                            title="View"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {contracts.length > 0 && (
          <div className="text-gray-500 text-sm text-right p-3 border-t">
            Showing {contracts.length} record{contracts.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default FreelanceContractTable;
