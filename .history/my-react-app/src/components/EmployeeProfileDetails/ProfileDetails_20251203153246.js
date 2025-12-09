import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Edit2, ChevronLeft, Briefcase } from "lucide-react";
import axios from "axios"; 
import TOC from "./TOC";
import CustomScrollbar from "../schollbar";

export default function ProfileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/api/employees/${id}/profile`);
        setEmployeeData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi tải profile:", err);
        setError("Không tìm thấy nhân viên hoặc lỗi server.");
        setLoading(false);
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const tocItems = [
    { id: "general-info", label: "General Information", level: 1 },
    { id: "job-section", label: "Job", level: 1 },
    { id: "contract-section", label: "Contract", level: 1 },
    { id: "payslip-section", label: "Payslip", level: 1 },
  ];

  if (loading) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!employeeData) return null;

  const { info, contracts, payslips } = employeeData;
  const latestPayslip = payslips && payslips.length > 0 ? payslips[0] : null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6 scroll-smooth">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-semibold">{info.Name}</h2>
              {/* Vì backend đang map Type vào Position, nên hiển thị Position ở đây là đúng */}
              <p className="text-sm text-gray-500">{info.Position}</p>
            </div>
          </div>
          
          {/* SỬA Ở ĐÂY: Hiển thị động theo info.Position và đổi màu tương ứng */}
          <span className={`text-xs font-medium px-3 py-1 rounded-full 
            ${info.Position === 'Fulltime' 
              ? 'bg-green-100 text-green-700'  // Nếu là Fulltime thì màu xanh
              : 'bg-orange-100 text-orange-700' // Nếu là Freelance thì màu cam
            }`}>
            {info.Position}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        {/* Left Content */}
        <div className="col-span-9 space-y-6">
          
          {/* General Info */}
          <section id="general-info" className="bg-white rounded-2xl shadow p-6 scroll-mt-24">
            <SectionHeader title="General Information" content="Edit" />
            <SubSection title="Personal Information">
              <InfoGrid data={{ "Employee ID": info.ID, Phone: info.Phone, Email: info.Email, Sex: "N/A" }} />
            </SubSection>
            <SubSection title="Address Information">
              <InfoGrid data={{ Address: info.Address, City: info.City }} />
            </SubSection>
          </section>

          {/* Job Section */}
          <section id="job-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-24">
            <SectionHeader title="Job" content="Edit"/>
            <SubSection title="Employment Information">
              <InfoGrid data={{ "Job Title": info.Position, Department: info.Department, "Start Date": info.StartDate }} />
            </SubSection>
          </section>

          {/* Contract Section - ĐÃ SỬA LỖI HIỂN THỊ */}
          <section id="contract-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-24">
            <SectionHeader title="Contract" showEdit={false} />
            
            {contracts && contracts.length > 0 ? (
              <>
                {/* Nếu nhiều hơn 2 hợp đồng -> Dùng thanh cuộn (CustomScrollbar) */}
                {contracts.length > 2 ? (
                  <div className="h-[450px]">
                    <CustomScrollbar>
                      <div className="space-y-4 pr-4 pb-2">
                        {contracts.map((contract) => (
                          <ContractItem key={contract.FullCon_ID} contract={contract} />
                        ))}
                      </div>
                    </CustomScrollbar>
                  </div>
                ) : (
                  /* Nếu ít hợp đồng (<= 2) -> Dùng div thường để tránh lỗi ẩn nội dung */
                  <div className="space-y-4">
                    {contracts.map((contract) => (
                      <ContractItem key={contract.FullCon_ID} contract={contract} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 italic text-center py-4">No contract data available</p>
            )}
          </section>

          {/* Payslip Section */}
          <section id="payslip-section" className="bg-white rounded-2xl shadow p-6 scroll-mt-24">
             <SectionHeader title="Payslip" showEdit={false} />
             {latestPayslip ? (
                <SubSection title="Latest Earning">
                   <InfoGrid data={{ "Month": latestPayslip.Month, "Net Pay": latestPayslip.NetPay }} />
                </SubSection>
             ) : <div>No payslip data</div>}
          </section>
        </div>

        <div className="col-span-3 sticky top-6">
          <TOC items={tocItems} />
        </div>
      </div>
    </div>
  );
}

// --- CÁC COMPONENT CON (Được định nghĩa ở đây) ---

// 1. ContractItem: Component hiển thị từng cái thẻ hợp đồng
function ContractItem({ contract }) {
  return (
    <div className={`border rounded-xl p-4 transition-colors ${contract.Status === 'Active' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-80'}`}>
      <div className="flex justify-between items-start mb-4 border-b border-gray-200/50 pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-gray-700">
            {contract.Type} <span className="text-xs text-gray-500">#{contract.FullCon_ID}</span>
          </span>
        </div>
        <span className="text-xs font-bold bg-green-200 text-green-800 px-2 py-1 rounded">
          {contract.Status}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SubSection title="Duration" className="mb-0">
          <InfoGrid data={{ "Start Date": contract.StartDate, "End Date": contract.EndDate || "Indefinite" }} />
        </SubSection>
        <SubSection title="Compensation" className="mb-0">
          {/* Dùng Number().toLocaleString() để format tiền tệ đẹp hơn */}
          <InfoGrid data={{ "Base Salary": contract.BaseSalary ? `${Number(contract.BaseSalary).toLocaleString()} VND` : 'N/A' }} />
        </SubSection>
      </div>
    </div>
  );
}

// 2. Các component khác
function SectionHeader({ title, showEdit = true, content }) { 
  return <div className="mb-4 border-b pb-2 font-bold flex justify-between"><h3>{title}</h3>{showEdit && <button className="text-sm text-orange-500"><Edit2 className="w-4 h-4 inline"/> {content}</button>}</div> 
}

function SubSection({ title, children, className="" }) { 
  return <div className={`mb-4 ${className}`}><h4 className="text-xs text-gray-500 uppercase mb-2">{title}</h4>{children}</div> 
}

function InfoGrid({ data }) { 
  return <div className="grid grid-cols-2 gap-2 text-sm">{Object.entries(data).map(([k,v]) => <div key={k}><span className="text-gray-400 block">{k}</span><span>{v || 'N/A'}</span></div>)}</div> 
}