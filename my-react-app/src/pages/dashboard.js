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

// Component bảng dữ liệu
function EmployeeTable({ data }) {
  return (
    <table className="w-full border-collapse text-left mt-6 text-sm">
      <thead>
        <tr className="bg-slate-300 text-gray-800">
          <th className="p-3 border">#</th>
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Position</th>
          <th className="p-3 border">Department</th>
          <th className="p-3 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((emp, index) => (
          <tr key={index} className="hover:bg-slate-100">
            <td className="p-3 border">{index + 1}</td>
            <td className="p-3 border">{emp.name}</td>
            <td className="p-3 border">{emp.role}</td>
            <td className="p-3 border">{emp.department}</td>
            <td className="p-3 border">{emp.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Component mô tả dài cho cuộn
function InfoSection({ title, text }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-700 leading-relaxed">{text}</p>
    </section>
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
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-900">Dashboard</h1>

      {/* Khu thống kê */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={employees.length} color="blue" />
        <StatCard title="Active Employees" value={employees.filter(e => e.status === 'Active').length} color="green" />
        <StatCard title="Inactive Employees" value={employees.filter(e => e.status === 'Inactive').length} color="red" />
      </div>

      {/* Bảng danh sách */}
      <EmployeeTable data={employees} />

      {/* Các phần mô tả dài */}
      <InfoSection
        title="Company Overview"
        text="Our company is a dynamic organization that values innovation, collaboration, and excellence. We aim to create a supportive environment where every employee can thrive and contribute to our mission. The HR Dashboard helps managers and executives track performance, monitor activities, and manage resources efficiently."
      />
      <InfoSection
        title="Goals for 2025"
        text="In 2025, we plan to expand our workforce by 30%, establish remote-friendly policies, and enhance employee training programs. We also aim to increase engagement through regular feedback sessions, transparent communication, and well-being initiatives."
      />
      <InfoSection
        title="Performance Highlights"
        text="The development team achieved a 20% improvement in project delivery speed this quarter. HR successfully implemented a digital onboarding process, reducing manual paperwork by 80%. The design team introduced new UI standards that improved product consistency across all departments."
      />
      <InfoSection
        title="Training and Development"
        text="We have introduced several new learning modules covering leadership, project management, and technical skills. The continuous learning culture at our company ensures that employees remain competitive and motivated."
      />
      <InfoSection
        title="Upcoming Projects"
        text="The IT department is preparing to migrate the HR management system to a cloud-native infrastructure. The finance team is adopting AI-powered analytics to enhance forecasting accuracy. Meanwhile, the marketing department is focusing on expanding brand visibility across Southeast Asia."
      />
      <InfoSection
        title="Sustainability and Social Impact"
        text="Our company is committed to sustainability. We are transitioning to paperless workflows, encouraging recycling, and supporting community programs. Employees are encouraged to volunteer at least 8 hours per quarter for social causes of their choice."
      />
      <InfoSection
        title="Conclusion"
        text="This dashboard serves as a central hub for tracking key performance indicators, managing employee information, and visualizing progress. Scroll down to explore detailed analytics, employee feedback, and more insights as we continue to build a better workplace."
      />

      {/* Lặp lại phần mô tả để đảm bảo đủ dài */}
      {[...Array(5)].map((_, i) => (
        <InfoSection
          key={i}
          title={`Additional Section ${i + 1}`}
          text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed commodo odio id diam vulputate, a condimentum enim facilisis. Suspendisse potenti. Integer non mattis ipsum, at gravida risus. Donec accumsan, justo ac efficitur malesuada, orci arcu tristique odio, ac tincidunt eros velit sit amet enim."
        />
      ))}
    </div>
  );
}

export default Dashboard;
