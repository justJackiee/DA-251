// import React from 'react';

// function EmployeeManagement() {
//     return <h1>Employee Management Page</h1>;
// };

// export default EmployeeManagement;
import React from "react";
import CEmployeeTable from "../components/Table/CEmployeeTable";
import HeaderTabs from '../components/HeaderTabs';
import FiltersBar from '../components/FiltersBar';
import CEmployeeTable from '../components/Table/CEmployeeTable';

function EmployeeManagement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Employee Management Page</h1>
      <CEmployeeTable />
    </div>
  );
}

export default EmployeeManagement;