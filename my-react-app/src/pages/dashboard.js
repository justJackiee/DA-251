import TotalEmployeesCard from '../components/Card/TotalEmployeesCard';
import WhosOnLeaveCard from "../components/Card/WhosOnLeaveCard";
import { NewComersCard } from "../components/Card/NewComersCard";
import UpComingCard from "../components/Card/UpComingCard";
import React, { useState, useEffect } from 'react';

// Thẻ thống kê nhỏ
function StatCard({ title, value, color }) {
  return (
    <div className={`flex flex-col items-center justify-center bg-${color}-100 p-4 rounded-xl shadow-md`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    </div>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fakeData = [];
    const departments = ['HR', 'IT', 'Design', 'Marketing', 'Finance'];
    const roles = ['Manager', 'Developer', 'Analyst', 'Designer', 'Intern'];
    for (let i = 1; i <= 50; i++) {
      fakeData.push({
        name: `Employee ${i}`,
        role: roles[i % roles.length],
        department: departments[i % departments.length],
        status: i % 2 === 0 ? 'Active' : 'Inactive',
      });
    }
    setEmployees(fakeData);
  }, []);

  return (
    <> <TotalEmployeesCard/>
    <WhosOnLeaveCard/>
    {/*<NewComersCard/>*/}
    <UpComingCard/>
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {/* Khu thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={employees.length} color="blue" />
        <StatCard title="Active Employees" value={employees.filter(e => e.status === 'Active').length} color="green" />
        <StatCard title="Inactive Employees" value={employees.filter(e => e.status === 'Inactive').length} color="red" />
      </div>
    </div>
    </>
  );
}

export default Dashboard;
