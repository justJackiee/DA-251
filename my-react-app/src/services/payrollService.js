import axios from 'axios';

// [NOTE] Đã cập nhật port thành 9000 theo yêu cầu
const API_URL = 'http://localhost:9000/api/payroll';

export const PayrollService = {
    // 1. Lấy danh sách Dashboard
    getPayrollList: async (month, year) => {
        try {
            const response = await axios.get(`${API_URL}`, {
                params: { month, year }
            });
            // Dữ liệu trả về bây giờ mỗi row sẽ có thêm field: payrollId
            return response.data;
        } catch (error) {
            console.error("Error fetching payroll list:", error);
            return [];
        }
    },

    // 2. Kích hoạt tính lương (Stored Procedure)
    generatePayroll: async (month, year) => {
        try {
            const response = await axios.post(`${API_URL}/calculate`, null, {
                params: { month, year }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || "Lỗi kết nối server";
        }
    },

    // 3. Lấy chi tiết phiếu lương
    getPayslipDetail: async (record) => {
        try {
            if (record.contractType === 'FULLTIME') {
                // [QUAN TRỌNG] Bây giờ record đã có payrollId từ BE, không lo bị null nữa
                if (!record.payrollId) {
                    console.warn("Missing payrollId for fulltime record:", record);
                }
                
                // Gọi API cấu trúc mới: /9000/api/payroll/{payrollId}/employee/{employeeId}
                const response = await axios.get(`${API_URL}/${record.payrollId}/employee/${record.employeeId}`);
                return response.data;
            } else {
                // Freelance vẫn dùng payslipId cũ
                const response = await axios.get(`${API_URL}/freelance/${record.payslipId}`);
                return response.data;
            }
        } catch (error) {
            console.error("Error fetching detail:", error);
            throw error;
        }
    },

    // 4. Chốt sổ lương (Lock)
    lockPayroll: async (payrollId) => {
        try {
            const response = await axios.post(`${API_URL}/${payrollId}/lock`);
            return response.data;
        } catch (error) {
            throw error.response?.data || "Không thể chốt lương";
        }
    },

    // 5. Lấy Metadata cho Dropdown (Bonus Types)
    getBonusMetadata: async () => {
        try {
            const response = await axios.get(`${API_URL}/metadata/bonus-types`);
            return response.data;
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return [];
        }
    },

    // 6. Helper tính toán Stats
    calculateStatsFromList: (list) => {
        if (!list || list.length === 0) {
            return {
                totalNet: 0, totalGross: 0, totalEmployees: 0, paidEmployees: 0,
                pendingCount: 0, failedCount: 0, status: 'No Data'
            };
        }

        const totalNet = list.reduce((sum, item) => sum + (item.netPay || 0), 0);
        const totalGross = list.reduce((sum, item) => sum + (item.grossPay || 0), 0);
        const totalEmployees = list.length;
        const paidEmployees = list.filter(i => i.status === 'Paid').length;
        const pendingCount = list.filter(i => i.status === 'Unpaid').length;
        const failedCount = list.filter(i => i.status === 'Failed').length;

        let overallStatus = 'Unpaid';
        if (paidEmployees === totalEmployees && totalEmployees > 0) {
            overallStatus = 'Paid';
        } else if (list.length > 0 && list[0].status) {
            overallStatus = list[0].status;
        }

        return {
            totalNet,
            totalGross,
            totalEmployees,
            paidEmployees,
            pendingCount,
            failedCount,
            status: overallStatus
        };
    }
};