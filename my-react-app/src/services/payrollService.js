import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payroll';

export const PayrollService = {
    // 1. Lấy danh sách Dashboard
    getPayrollList: async (month, year) => {
        try {
            const response = await axios.get(`${API_URL}`, {
                params: { month, year }
            });
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
            return response.data; // Trả về message string
        } catch (error) {
            throw error.response?.data || "Lỗi kết nối server";
        }
    },

    // 3. Lấy chi tiết phiếu lương (Fulltime/Freelance)
    getPayslipDetail: async (id, type) => {
        // type nhận vào là "FULLTIME" hoặc "FREELANCE" từ DTO backend
        const endpoint = type === 'FREELANCE' ? 'freelance' : 'fulltime';
        const response = await axios.get(`${API_URL}/${endpoint}/${id}`);
        return response.data;
    },

    // 4. Helper tính toán Stats ngay tại Frontend (vì Backend chưa có API stats)
    calculateStatsFromList: (list) => {
        const totalPayroll = list.reduce((sum, item) => sum + (item.netPay || 0), 0);
        const totalEmployees = list.length;
        // Giả sử status 'Paid' là đã trả, 'Unpaid' là pending
        const paidEmployees = list.filter(i => i.status === 'Paid').length;
        const pendingCount = list.filter(i => i.status === 'Unpaid').length;
        const failedCount = list.filter(i => i.status === 'Failed').length;

        // Logic trạng thái tổng của kỳ lương
        let overallStatus = 'Unpaid';
        if (totalEmployees > 0 && paidEmployees === totalEmployees) overallStatus = 'Paid';
        else if (list.length === 0) overallStatus = 'No Data';

        return {
            totalPayroll,
            totalEmployees,
            paidEmployees,
            pendingCount,
            failedCount,
            status: overallStatus
        };
    }
};