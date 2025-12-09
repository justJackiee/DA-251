import React, { useEffect, useState } from 'react';
import { PayrollService } from '../services/payrollService';

const PayslipDetailModal = ({ isOpen, onClose, payslipId, type }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && payslipId) {
            fetchDetail();
        } else {
            setData(null);
        }
    }, [isOpen, payslipId]);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const result = await PayrollService.getPayslipDetail(payslipId, type);
            setData(result);
        } catch (error) {
            console.error("Failed to load payslip", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const formatCurrency = (amount) => 
        new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

    // Helper render dòng item (Allowance, Bonus...)
    const renderItems = (items, title, colorClass = "text-gray-600") => {
        if (!items || items.length === 0) return null;
        return (
            <div className="mb-4">
                <h4 className={`font-semibold text-sm uppercase mb-2 ${colorClass}`}>{title}</h4>
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium text-gray-800">{formatCurrency(item.amount)}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
                
                {/* Header */}
                <div className="bg-emerald-600 px-6 py-4 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Phiếu Lương Chi Tiết</h2>
                        <p className="text-emerald-100 text-xs mt-1">ID: #{payslipId} • {type}</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-emerald-700 p-2 rounded-full transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>
                    ) : data ? (
                        <>
                            {/* Thông tin nhân viên */}
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">{data.employeeName}</h3>
                                <p className="text-gray-500">{data.period}</p>
                            </div>

                            {/* Tổng quan Lương */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-6 grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Lương Gross (Base)</p>
                                    <p className="font-semibold text-gray-800 text-lg">{formatCurrency(data.grossSalary)}</p>
                                </div>
                                <div className="border-l border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase">Thực nhận (Net)</p>
                                    <p className="font-bold text-emerald-600 text-lg">{formatCurrency(data.netSalary)}</p>
                                </div>
                            </div>

                            {/* Chi tiết các khoản */}
                            <div className="space-y-4">
                                {renderItems(data.allowances, "Phụ cấp (Earnings)", "text-blue-600")}
                                {renderItems(data.bonuses, "Thưởng (Bonuses)", "text-green-600")}
                                {renderItems(data.deductions, "Khấu trừ (Deductions)", "text-red-600")}
                            </div>

                            {/* Footer */}
                            <div className="mt-8 pt-4 border-t border-gray-200 flex justify-between items-end">
                                <div className="text-xs text-gray-400 italic">
                                    * Thông tin bảo mật. Vui lòng không chia sẻ.
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-600">Tổng thực nhận</p>
                                    <p className="text-2xl font-bold text-emerald-600">{formatCurrency(data.netSalary)}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-red-500">Không tìm thấy dữ liệu.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayslipDetailModal;