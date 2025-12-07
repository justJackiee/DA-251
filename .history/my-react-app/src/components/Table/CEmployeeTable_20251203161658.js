import React from "react";

function CEmployeeTable({ 
  // SỬA LỖI 2: Nhận prop 'data' thay vì 'employees' để khớp với file cha
  data = [], 
  columns = null, 
  title = "Employee List",
  showActions = true,
  onEdit = null 
}) {
  // Gán data vào biến employees để dùng tiếp logic bên dưới
  const employees = data;

  // SỬA LỖI 3: Cập nhật cấu hình cột khớp với tên biến trong MOCK DATA (fullName, email...)
  const defaultColumns = [
    { header: "ID", accessor: "id" },
    { header: "Full Name", accessor: "fullName" }, // Dùng accessor trực tiếp vì data đã nối chuỗi rồi
    { header: "Position", accessor: "position" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { 
      header: "Sex", 
      // Sửa logic render giới tính
      render: (row) => row.sex === 'M' ? 'Male' : row.sex === 'F' ? 'Female' : row.sex 
    },
    { 
      header: "Type", 
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            // Sửa logic check màu dựa trên value thực tế
            row.type === "HR" ? "bg-purple-100 text-purple-700" : 
            row.type === "Freelance" ? "bg-orange-100 text-orange-700" : 
            "bg-blue-100 text-blue-700"
        }`}>
          {row.type}
        </span>
      )
    },
    {
      header: "Status",
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Active" ? "bg-green-100 text-green-700" : 
            row.status === "Inactive" ? "bg-red-100 text-red-700" : 
            "bg-gray-100 text-gray-700"
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const tableColumns = columns || defaultColumns;

  const handleEdit = (item) => {
    if (onEdit) {
      onEdit(item);
    } else {
      window.location.href = `/employeemanagement/profile/${item.id}`;
    }
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
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={tableColumns.length + (showActions ? 1 : 0)} className="py-8 text-center text-gray-400">
                    No data found
                  </td>
                </tr>
              ) : (
                employees.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex} className={`${rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50 transition`}>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex} className="py-3 px-4 text-left border-b text-sm">
                        {/* Logic render an toàn */}
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                    {showActions && (
                      <td className="py-3 px-4 text-left border-b text-sm">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-blue-600"
                          aria-label={`View ${item.fullName || item.id}`}
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <circle cx="12" cy="6" r="1.5" />
                            <circle cx="12" cy="12" r="1.5" />
                            <circle cx="12" cy="18" r="1.5" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {employees.length > 0 && (
          <div className="text-gray-500 text-sm text-right p-3 border-t">
            Showing {employees.length} record{employees.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default CEmployeeTable;