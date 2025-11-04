// import React from 'react';

// function EmployeeManagement() {
//     return <h1>Employee Management Page</h1>;
// };

// export default EmployeeManagement;
import React from "react";
import ReactDOM from 'react-dom';
import CEmployeeTable from "../components/Table/CEmployeeTable";
import HeaderTabs from '../components/HeaderTabs';
import FiltersBar from '../components/FiltersBar';

export default function EmployeeManagement() {
  const [activeTab, setActiveTab] = React.useState('team');
  const [search, setSearch] = React.useState('');
  const [filters, setFilters] = React.useState({ office: '', department: '' });
  const [data, setData] = React.useState([]); // fetch or use existing data

  // fetch employees effect (or use existing data loader)
  React.useEffect(() => {
    // fetch('/api/employees').then(r => r.json()).then(setData);
  }, []);

  const onFilterChange = (k, v) => setFilters((s) => ({ ...s, [k]: v }));
  const onClear = () => { setSearch(''); setFilters({ office: '', department: '' }); };

  return (
    <div>
      <HeaderTabs active={activeTab} onTabChange={setActiveTab} />
      {/* Render FiltersBar in a portal to escape the scroll container so native selects render correctly */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        <FiltersBar search={search} onSearch={setSearch} filters={filters} onFilterChange={onFilterChange} onClear={onClear} />,
        document.body
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CEmployeeTable data={data} search={search} filters={filters} />
      </div>
    </div>
  );
}