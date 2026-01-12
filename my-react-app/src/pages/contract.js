import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import FullTimeContractTable from "../components/Table/FullTimeContractTable";
import FreelanceContractTable from "../components/Table/FreelanceContractTable";
import FiltersBar from "../components/FiltersBar";
import ContractDetailModal from "../components/ContractDetailModal";

function Contract() {
  const [activeTab, setActiveTab] = useState("fulltime");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ type: "", status: "" });

  const [fullTimeData, setFullTimeData] = useState([]);
  const [freelanceData, setFreelanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState(null);

  // Lọc theo type (Definite / Indefinite)
  const types = useMemo(() => {
    const set = new Set();
    fullTimeData.forEach(d => d.type && set.add(d.type));
    return Array.from(set);
  }, [fullTimeData]);

  // Lọc theo status (Active / Expired)
  const statuses = useMemo(() => {
    const set = new Set();
    fullTimeData.forEach(d => d.status && set.add(d.status));
    return Array.from(set);
  }, [fullTimeData]);

  // Fetch full time contracts
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        // Fetch fulltime contracts and employees in parallel
        const [resFullTime, resEmployees] = await Promise.all([
          axios.get('/api/fulltime-contracts'),
          axios.get('/api/employees')
        ]);

        console.log("[Contract] API response:", resFullTime, resEmployees);

        const rawFullTime = Array.isArray(resFullTime.data) ? resFullTime.data : (resFullTime.data && Array.isArray(resFullTime.data.data) ? resFullTime.data.data : []);
        const employeesRaw = Array.isArray(resEmployees.data) ? resEmployees.data : (resEmployees.data && Array.isArray(resEmployees.data.data) ? resEmployees.data.data : []);

        // Build employee id -> full name map
        const empMap = {};
        employeesRaw.forEach(e => {
          const fullName = `${e.fName || e.f_name || ''}${e.mName ? ' ' + e.mName : ''}${e.lName ? ' ' + e.lName : ''}`.trim();
          empMap[e.id || e.ID || e.employeeId] = fullName;
        });

        const parseToDate = (val) => {
          if (!val) return null;
          if (typeof val === "string") return new Date(val);
          if (typeof val === "object" && val.year) return new Date(val.year, val.month - 1, val.day);
          try { return new Date(val); } catch (e) { return null; }
        };

        // Format fulltime contracts
        const formattedFullTime = rawFullTime.map(ct => {
          const endDateObj = parseToDate(ct.endDate || ct.end_date || ct.endDateObject);
          const isExpired = endDateObj ? endDateObj < new Date() : false;

          const contractId = ct.contractId || ct.contract_id || ct.id;
          const employeeId = ct.employeeId || ct.employee_id || ct.employeeIdValue;
          const startDateRaw = ct.startDate || ct.start_date || null;
          const endDateRaw = ct.endDate || ct.end_date || (endDateObj ? endDateObj.toISOString().slice(0,10) : null);
          const baseSalary = ct.baseSalary || ct.base_salary || null;
          const otRate = ct.otRate || ct.ot_rate || null;
          const annualLeaveDays = ct.annualLeaveDays || ct.annual_leave_days || null;
          const typeVal = ct.type || ct.contractType || null;

          return {
            contract_id: contractId,
            employee_id: employeeId,
            employee_name: empMap[employeeId] || empMap[String(employeeId)] || '',
            start_date: startDateRaw,
            end_date: endDateRaw,
            base_salary: baseSalary,
            ot_rate: otRate,
            annual_leave_days: annualLeaveDays,
            type: typeVal,
            status: isExpired ? "Expired" : "Active"
          };
        });

        // Try to parse JSON fields from backend (allowances/bonuses/deductions)
        const parseListField = (v) => {
          if (!v) return [];
          try {
            if (typeof v === 'string') return JSON.parse(v);
            if (Array.isArray(v)) return v;
            return [];
          } catch (e) { return [] }
        };

        // Attach parsed lists if backend provided JSON fields
        const formattedFullTimeWithLists = formattedFullTime.map((f, idx) => {
          const src = rawFullTime[idx] || {};
          return {
            ...f,
            allowances: parseListField(src.allowancesJson || src.allowances || src.allowances_json),
            bonuses: parseListField(src.bonusesJson || src.bonuses || src.bonuses_json),
            deductions: parseListField(src.deductionsJson || src.deductions || src.deductions_json)
          };
        });

        setFullTimeData(formattedFullTimeWithLists || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load fulltime contract data:", err);
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // Fetch freelance contracts
  useEffect(() => {
    const fetchFreelanceContracts = async () => {
      try {
        const [resFreelance, resEmployees] = await Promise.all([
          axios.get('/api/freelance-contracts'),
          axios.get('/api/employees')
        ]);

        const rawFreelance = Array.isArray(resFreelance.data) ? resFreelance.data : (resFreelance.data && Array.isArray(resFreelance.data.data) ? resFreelance.data.data : []);
        const employeesRaw = Array.isArray(resEmployees.data) ? resEmployees.data : (resEmployees.data && Array.isArray(resEmployees.data.data) ? resEmployees.data.data : []);

        // Build employee id -> full name map
        const empMap = {};
        employeesRaw.forEach(e => {
          const fullName = `${e.fName || e.f_name || ''}${e.mName ? ' ' + e.mName : ''}${e.lName ? ' ' + e.lName : ''}`.trim();
          empMap[e.id || e.ID || e.employeeId] = fullName;
        });

        const parseToDate = (val) => {
          if (!val) return null;
          if (typeof val === "string") return new Date(val);
          if (typeof val === "object" && val.year) return new Date(val.year, val.month - 1, val.day);
          try { return new Date(val); } catch (e) { return null; }
        };

        // Format freelance contracts (match server entity `freelance_contract`)
        const formattedFreelance = rawFreelance.map(ct => {
          const endDateObj = parseToDate(ct.endDate || ct.end_date || ct.endDateObject);
          const isExpired = endDateObj ? endDateObj < new Date() : false;

          const contractId = ct.contractId || ct.contract_id || ct.id;
          const employeeId = ct.employeeId || ct.employee_id || ct.employeeIdValue;
          const startDateRaw = ct.startDate || ct.start_date || null;
          const endDateRaw = ct.endDate || ct.end_date || (endDateObj ? endDateObj.toISOString().slice(0,10) : null);
          const value = ct.value || ct.contractValue || ct.value_amount || ct.amount || null;
          const committedDeadlineRaw = ct.committedDeadline || ct.committed_deadline || null;

          return {
            contract_id: contractId,
            employee_id: employeeId,
            employee_name: empMap[employeeId] || empMap[String(employeeId)] || '',
            start_date: startDateRaw,
            end_date: endDateRaw,
            value: value,
            committed_deadline: committedDeadlineRaw,
            status: isExpired ? "Expired" : "Active"
          };
        });

        // Attach lists for freelance (bonuses, penalties -> map to bonuses/deductions)
        const formattedFreelanceWithLists = formattedFreelance.map((f, idx) => {
          const src = rawFreelance[idx] || {};
          const parse = (v) => {
            if (!v) return [];
            try { if (typeof v === 'string') return JSON.parse(v); if (Array.isArray(v)) return v; } catch(e) {}
            return [];
          };
          return {
            ...f,
            bonuses: parse(src.bonusesJson || src.bonuses || src.bonuses_json),
            deductions: parse(src.penaltiesJson || src.penalties || src.penalties_json) // map penalties -> deductions
          };
        });

        setFreelanceData(formattedFreelanceWithLists || []);
      } catch (err) {
        console.error("Failed to load freelance contract data:", err);
      }
    };

    fetchFreelanceContracts();
  }, []);

  const onFilterChange = (k, v) =>
    setFilters((prev) => ({ ...prev, [k]: v }));

  const onClear = () => {
    setSearch("");
    setFilters({ type: "", status: "" });
  };

  const filteredData = useMemo(() => {
    const data = activeTab === "fulltime" ? fullTimeData : freelanceData;
    return data.filter((c) => {
      const s = search.toLowerCase();

      const matchSearch =
        (c.contract_id && c.contract_id.toString().includes(s)) ||
        (c.employee_id && c.employee_id.toString().includes(s)) ||
        (c.employee_name && c.employee_name.toLowerCase().includes(s));

      const matchType = filters.type ? c.type === filters.type : true;
      const matchStatus = filters.status ? c.status === filters.status : true;

      return matchSearch && matchType && matchStatus;
    });
  }, [search, filters, fullTimeData, freelanceData, activeTab]);

  if (loading)
    return <div className="p-10 text-center">Đang tải hợp đồng...</div>;

  const handleViewContract = (contract) => {
    const attachPayslip = async () => {
      try {
        // Get payroll dashboard (contains payslipId and payrollId)
        const res = await axios.get('/api/payroll');
        const list = Array.isArray(res.data) ? res.data : [];

        const empId = contract.employee_id || contract.employeeId || contract.employeeIdValue;

        if (contract.base_salary !== undefined) {
          // Fulltime: try to find matching FULLTIME payslip in dashboard
          const match = list.find(i => (i.employeeId == empId) && (i.contractType === 'FULLTIME') && i.payslipId);
          let payrollId = null;
          if (match && match.payrollId) payrollId = match.payrollId;
          else {
            // fallback: use latest payrollId from list
            const ids = list.map(i => i.payrollId).filter(Boolean);
            payrollId = ids.length ? Math.max(...ids) : null;
          }

          if (payrollId) {
            try {
              const detail = (await axios.get(`/api/payroll/${payrollId}/employee/${empId}`)).data || {};
              contract.allowances = detail.allowances || [];
              contract.bonuses = detail.bonuses || [];
              contract.deductions = detail.deductions || [];
            } catch (err) {
              console.error('Failed to load fulltime payslip detail', err);
              contract.allowances = contract.allowances || [];
              contract.bonuses = contract.bonuses || [];
              contract.deductions = contract.deductions || [];
            }
          }
        } else {
          // Freelance: try to find matching FREELANCE payslip in dashboard and use payslipId
          const match = list.find(i => (i.employeeId == empId) && (i.contractType === 'FREELANCE') && i.payslipId);
          if (match && match.payslipId) {
            try {
              const detail = (await axios.get(`/api/payroll/freelance/${match.payslipId}`)).data || {};
              contract.allowances = detail.allowances || [];
              contract.bonuses = detail.bonuses || [];
              contract.deductions = detail.deductions || [];
            } catch (err) {
              console.error('Failed to load freelance payslip detail', err);
              contract.allowances = contract.allowances || [];
              contract.bonuses = contract.bonuses || [];
              contract.deductions = contract.deductions || [];
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch payroll dashboard', err);
      } finally {
        setSelectedContract({ ...contract });
      }
    };

    attachPayslip();
  };

  return (
    <div>
      <FiltersBar
        search={search}
        onSearch={setSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        onClear={onClear}
        types={types}
        statuses={statuses}
        positions={[]}
        genders={[]}
        showAdd={false}
        showFilters={false}
      />

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-0 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("fulltime")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "fulltime"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Fulltime Contract
          </button>
          <button
            onClick={() => setActiveTab("freelance")}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === "freelance"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Freelance Contract
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "fulltime" && (
            <FullTimeContractTable
              data={filteredData}
              search={search}
              filters={filters}
              onEdit={handleViewContract}
              columns={[
                { header: 'Contract ID', accessor: 'contract_id' },
                { header: 'Employee ID', accessor: 'employee_id' },
                { header: 'Employee Name', accessor: 'employee_name' },
                { header: 'Start Date', accessor: 'start_date' },
                { header: 'End Date', accessor: 'end_date' },
                {
                  header: 'Base Salary',
                  render: (row) => `${Number(row.base_salary || 0).toLocaleString()} VND`
                },
                { header: 'OT Rate', accessor: 'ot_rate' },
                { header: 'Annual Leave', render: (row) => `${row.annual_leave_days || 0} days` },
                { header: 'Type', render: (row) => (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.type === "Indefinite" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {row.type}
                    </span>
                  ) }
              ]}
            />
          )}

          {activeTab === "freelance" && (
            <FreelanceContractTable
              data={filteredData}
              search={search}
              filters={filters}
              onEdit={handleViewContract}
              columns={[
                { header: 'Contract ID', accessor: 'contract_id' },
                { header: 'Employee ID', accessor: 'employee_id' },
                { header: 'Employee Name', accessor: 'employee_name' },
                { header: 'Start Date', accessor: 'start_date' },
                { header: 'End Date', accessor: 'end_date' },
                {
                  header: 'Value',
                  render: (row) => `${Number(row.value || 0).toLocaleString()} VND`
                },
                { header: 'Committed Deadline', accessor: 'committed_deadline' },
                { header: 'Status', accessor: 'status' }
              ]}
            />
          )}
        </div>
      </div>

      {selectedContract && (
        <ContractDetailModal
          contract={selectedContract}
          onClose={() => setSelectedContract(null)}
        />
      )}
    </div>
  );
}

export default Contract;
