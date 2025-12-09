import React, { useEffect, useState, useMemo } from "react";
import axios from "axios"; // 1. Import axios
import CEmployeeTable from "../components/Table/CEmployeeTable";
// import HeaderTabs from '../components/HeaderTabs';
import FiltersBar from '../components/FiltersBar';



function EmployeeManagement() {
  // const [activeTab, setActiveTab] = useState('team');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ office: '', department: '' });
  
  // 2. Khởi tạo data là mảng rỗng ban đầu (thay vì mock data)
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // derive unique positions from fetched data for filter options
  const positions = useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set();
    data.forEach((d) => {
      if (d.position) set.add(d.position);
    });
    return Array.from(set);
  }, [data]);

  const genders = useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set();
    data.forEach((d) => {
      if (d.sex) set.add(d.sex);
    });
    return Array.from(set);
  }, [data]);

  const types = useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set();
    data.forEach((d) => {
      if (d.type) set.add(d.type);
    });
    return Array.from(set);
  }, [data]);

  const statuses = useMemo(() => {
    if (!data || data.length === 0) return [];
    const set = new Set();
    data.forEach((d) => {
      if (d.status) set.add(d.status);
    });
    return Array.from(set);
  }, [data]);

 // 3. Gọi API từ Backend khi component được load
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/employees');
        const apiData = response.data;

        // 4. MAPPING DỮ LIỆU (ĐÃ SỬA LỖI)
        const formattedData = apiData.map(emp => {
          // Xử lý an toàn: Nếu không có chức vụ thì để chuỗi rỗng
          const safePosition = emp.position || ''; 
          
          return {
            id: emp.id,
            // Ghép họ tên
            fullName: `${emp.fName} ${emp.mName ? emp.mName + ' ' : ''}${emp.lName}`,
            email: emp.email,
            phone: emp.phone,
            sex: emp.sex,
            // Nếu không có position thì hiện 'Staff' mặc định
            position: safePosition || 'Staff', 
            type: emp.type, // Lưu ý: Backend bạn trả về 'type', không phải 'ceType' (check lại console log nếu cần)
            status: emp.status,
            // Xử lý địa chỉ an toàn
            location: emp.address ? emp.address.split(',').pop().trim() : 'Unknown',
            // SỬA LỖI CHÍNH TẠI ĐÂY: Kiểm tra safePosition thay vì emp.position
            department: safePosition.includes('HR') ? 'Human Resources' : 'Engineering'
          };
        });

        setData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhân viên:", error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const onFilterChange = (k, v) => setFilters((s) => ({ ...s, [k]: v }));
  const onClear = () => { setSearch(''); setFilters({ office: '', department: '' }); };

  const filteredData = useMemo(() => {
    return data.filter(emp => {
      const searchLower = search.toLowerCase();
      // Logic search cũ của bạn giữ nguyên
      const matchSearch = (emp.fullName && emp.fullName.toLowerCase().includes(searchLower)) || 
                          (emp.email && emp.email.toLowerCase().includes(searchLower));
      
      // Logic filter
      // Lưu ý: Nếu database chưa chuẩn department/office thì bộ lọc này có thể lọc hết dữ liệu.
      // Tạm thời tôi để logic lỏng hơn: Nếu filter rỗng thì luôn true.
      const matchDept = filters.department ? emp.department === filters.department : true;
      const matchOffice = filters.office ? (emp.location && emp.location.includes(filters.office)) : true;
      
      return matchSearch && matchDept && matchOffice;
    });
  }, [data, search, filters]);

  if (loading) {
    return <div className="p-10 text-center">Đang tải dữ liệu từ Server...</div>;
  }

  return (
    <div>
      {/* <HeaderTabs active={activeTab} onTabChange={setActiveTab} /> */}
      <div className="flex justify-end">
        
      </div>
      <FiltersBar search={search} onSearch={setSearch} filters={filters} onFilterChange={onFilterChange} onClear={onClear} positions={positions} genders={genders} types={types} statuses={statuses} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CEmployeeTable data={filteredData} search={search} filters={filters} />
      </div>
    </div>
  );
}

export default EmployeeManagement;