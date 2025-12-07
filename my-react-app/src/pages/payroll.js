import React, { useEffect, useState } from 'react';
import { PayrollService } from '../services/payrollService';
import PayslipDetailModal from '../components/PayslipDetailModal';
import { CiDollar } from "react-icons/ci";
import { MdOutlinePendingActions, MdOutlineAccountBalanceWallet } from "react-icons/md";
import { FaUsers } from 'react-icons/fa';

const PayrollPage = () => {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    
    // Data State
    const [payslips, setPayslips] = useState([]);
    const [stats, setStats] = useState({
        totalPayroll: 0,
        totalEmployees: 0,
        paidEmployees: 0,
        pendingCount: 0,
        status: 'No Data'
    });

    // Modal State
    const [selectedPayslip, setSelectedPayslip] = useState({ id: null, type: '' });

    useEffect(() => {
        fetchData();
    }, [month, year]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Lấy danh sách từ Backend
            const listData = await PayrollService.getPayrollList(month, year);
            setPayslips(listData);

            // 2. Tự tính toán Stats từ danh sách (Client-side calculation)
            const statsData = PayrollService.calculateStatsFromList(listData);
            setStats(statsData);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        // Confirmation dùng confirm chuẩn của browser
        if (!window.confirm(`Xác nhận tính lương cho tháng ${month}/${year}? Dữ liệu cũ (nếu có) sẽ bị ghi đè.`)) return;
        
        setLoading(true);
        try {
            await PayrollService.generatePayroll(month, year);
            alert("✅ Tính lương thành công!");
            fetchData(); // Reload data
        } catch (error) {
            alert("❌ Lỗi: " + (typeof error === 'string' ? error : JSON.stringify(error)));
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
    };

    const getStatusBadge = (status) => {
        const styles = {
            Paid: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            Unpaid: "bg-amber-100 text-amber-700 border border-amber-200",
            Pending: "bg-purple-100 text-purple-700 border border-purple-200",
            Failed: "bg-red-100 text-red-700 border border-red-200",
            'No Data': "bg-gray-100 text-gray-500"
        };
        const style = styles[status] || styles['No Data'];
        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style}`}>{status}</span>;
    };

    const StatIconWrapper = ({ icon, color, bgColor }) => (
        <div className={`p-3 rounded-xl inline-flex items-center justify-center ${bgColor} ${color}`}>
            {React.cloneElement(icon, { className: "text-2xl" })}
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans">
            {/* --- MODAL --- */}
            <PayslipDetailModal 
                isOpen={!!selectedPayslip.id} 
                onClose={() => setSelectedPayslip({ id: null, type: '' })} 
                payslipId={selectedPayslip.id}
                type={selectedPayslip.type}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Quản Lý Lương</h1>
                    <p className="text-gray-500 mt-1">Theo dõi và xử lý bảng lương nhân sự</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm border border-gray-200 mt-4 md:mt-0">
                    <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer hover:text-emerald-600">
                        {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <span className="text-gray-300">|</span>
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="bg-transparent font-medium text-gray-700 outline-none cursor-pointer hover:text-emerald-600">
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                    </select>
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md shadow-md transition-all flex items-center gap-2 font-medium disabled:opacity-70 text-sm"
                    >
                        {loading ? "Đang xử lý..." : "⚡ Tính Lương"}
                    </button>
                </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                    <StatIconWrapper icon={<CiDollar />} color="text-blue-600" bgColor="bg-blue-50" />
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Tổng quỹ lương</p>
                        <h3 className="text-xl font-bold text-gray-800">{formatCurrency(stats.totalPayroll)}</h3>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                    <StatIconWrapper icon={<FaUsers />} color="text-emerald-600" bgColor="bg-emerald-50" />
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Đã thanh toán</p>
                        <h3 className="text-xl font-bold text-gray-800">{stats.paidEmployees} <span className="text-gray-400 text-sm font-normal">/ {stats.totalEmployees}</span></h3>
                    </div>
                </div>
                
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                    <StatIconWrapper icon={<MdOutlineAccountBalanceWallet />} color="text-amber-600" bgColor="bg-amber-50" />
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Trạng thái kỳ</p>
                        <div className="mt-1">{getStatusBadge(stats.status)}</div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1">
                    <StatIconWrapper icon={<MdOutlinePendingActions />} color="text-purple-600" bgColor="bg-purple-50" />
                    <div>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Đang chờ duyệt</p>
                        <h3 className="text-xl font-bold text-purple-600">{stats.pendingCount}</h3>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                <th className="p-5">Nhân viên</th>
                                <th className="p-5">Phòng ban</th>
                                <th className="p-5">Vai trò</th>
                                <th className="p-5 text-center">Gross</th>
                                <th className="p-5 text-center">Net</th>
                                <th className="p-5 text-center">Trạng thái</th>
                                <th className="p-5 text-center">Ngày trả</th>
                                <th className="p-5 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payslips.length > 0 ? payslips.map((item) => (
                                <tr key={item.payslipId} className="hover:bg-gray-50 transition-colors group">
                                    <td className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                {item.fullName?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800 text-sm">{item.fullName}</p>
                                                <p className="text-xs text-gray-400">ID: {item.employeeId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-sm text-gray-600">{item.department || "Engineering"}</td>
                                    <td className="p-5">
                                        <span className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                                            {item.role || item.contractType}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right font-mono font-bold text-gray-800">
                                        {formatCurrency(item.netPay)}
                                    </td>
                                    <td className="p-5 text-center">{getStatusBadge(item.status)}</td>
                                    <td className="p-5 text-center text-sm text-gray-500">
                                        {item.paymentDate ? new Date(item.paymentDate).toLocaleDateString('vi-VN') : "-"}
                                    </td>
                                    <td className="p-5 text-center">
                                        <button 
                                            onClick={() => setSelectedPayslip({ id: item.payslipId, type: item.contractType })}
                                            className="text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-all"
                                            title="Xem chi tiết phiếu lương"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-3">
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                            <p className="text-gray-500 font-medium">Chưa có dữ liệu lương</p>
                                            <p className="text-gray-400 text-sm mt-1">Chọn tháng khác hoặc bấm "Tính Lương"</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;