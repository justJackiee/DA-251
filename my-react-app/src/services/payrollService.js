import axios from 'axios';

const API_URL = 'http://localhost:5000/api/payroll';

export const PayrollService = {
    
    // =================================================================
    // 1. DASHBOARD & METADATA
    // =================================================================
    
    // Lấy danh sách bảng lương (Hiển thị Dashboard)
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

    // Lấy danh sách loại thưởng (Metadata cho Dropdown trong Popup Edit)
    getBonusMetadata: async () => {
        try {
            const response = await axios.get(`${API_URL}/metadata/bonus-types`);
            return response.data; // Trả về: [{key: 'holiday', label: 'Holiday Bonus'}, ...]
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return [];
        }
    },

    getFreelanceTerms: async (employeeId, month, year) => {
        try {
            const response = await axios.get(`${API_URL}/freelance-contract-terms`, {
                params: { employeeId, month, year }
            });
            return response.data; // { bonuses: [], penalties: [] }
        } catch (error) {
            console.error("Error fetching freelance terms:", error);
            // Trả về mặc định để không crash UI
            return { bonuses: [], penalties: [] };
        }
    },

    // =================================================================
    // 2. TÍNH TOÁN (CALCULATION CORE)
    // =================================================================

    /**
     * TÍNH TẤT CẢ (CALCULATE ALL)
     * Dùng cho nút "Tính lương" trên Header Dashboard.
     * Gửi employeeInputs = [] để Backend tự quét toàn bộ nhân viên Active.
     */
    calculateAll: async (month, year) => {
        try {
            const payload = {
                month: parseInt(month),
                year: parseInt(year),
                employeeInputs: [] // Rỗng -> Tính tất cả
            };
            
            const response = await axios.post(`${API_URL}/calculate`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi kết nối server" };
        }
    },

    /**
     * TÍNH LẠI 1 NGƯỜI (RE-CALCULATE / EDIT)
     * Dùng cho Popup "Edit/Nhập liệu".
     * Gửi danh sách chứa đúng 1 nhân viên kèm thông tin nhập tay.
     * * @param {Object} params Input từ Form
     * @param {number} params.month
     * @param {number} params.year
     * @param {number} params.employeeId
     * @param {string} params.type 'Fulltime' hoặc 'Freelance'
     * @param {number} [params.otHours] (Chỉ Fulltime)
     * @param {Object} [params.manualBonuses] Map { 'holiday': 500000 } (Chỉ Fulltime)
     * @param {Array} [params.selectedBonuses] List ['Early Completion'] (Chỉ Freelance)
     * @param {Array} [params.selectedPenalties] List ['Late Delivery'] (Chỉ Freelance)
     */
    recalculateSingle: async (params) => {
        try {
            // Chuẩn bị object employeeInput dựa trên loại nhân viên
            const employeeInput = {
                employeeId: params.employeeId
            };

            if (params.type === 'Fulltime') {
                employeeInput.fulltimeManualBonuses = params.manualBonuses || {};
            } else {
                // Freelance
                employeeInput.freelanceSelectedBonuses = params.selectedBonuses || [];
                employeeInput.freelanceSelectedPenalties = params.selectedPenalties || [];
            }

            // Gửi Request (Wrap vào mảng employeeInputs)
            const payload = {
                month: parseInt(params.month),
                year: parseInt(params.year),
                employeeInputs: [employeeInput]
            };

            const response = await axios.post(`${API_URL}/calculate`, payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Lỗi tính toán lại" };
        }
    },

    // =================================================================
    // 3. CHI TIẾT & TRẠNG THÁI
    // =================================================================

    // Lấy chi tiết phiếu lương (Popup View)
    getPayslipDetail: async (record) => {
        try {
            // record lấy từ dòng trong bảng Dashboard
            if (!record.payrollId || !record.employeeId) {
                throw new Error("Thiếu ID để lấy chi tiết");
            }

            // Gọi Endpoint thống nhất mới
            const response = await axios.get(`${API_URL}/${record.payrollId}/employee/${record.employeeId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching detail:", error);
            throw error;
        }
    },

    // Chốt sổ lương (Lock)
    lockPayroll: async (payrollId) => {
        try {
            const response = await axios.post(`${API_URL}/${payrollId}/lock`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: "Không thể chốt lương" };
        }
    },

    // Helper tính toán thống kê (Tính tại Client để hiển thị Card)
    calculateStatsFromList: (list) => {
        if (!list || list.length === 0) {
            return {
                totalNet: 0, totalGross: 0, totalEmployees: 0, 
                paidEmployees: 0, pendingCount: 0, status: 'Unpaid'
            };
        }

        const totalNet = list.reduce((sum, item) => sum + (item.netPay || 0), 0);
        const totalGross = list.reduce((sum, item) => sum + (item.grossPay || 0), 0);
        const totalEmployees = list.length;
        const paidEmployees = list.filter(i => i.status === 'Paid').length;
        const pendingCount = list.filter(i => i.status === 'Unpaid').length;

        // Xác định trạng thái chung của kỳ lương
        let overallStatus = 'Unpaid';
        // Nếu tất cả đã Paid -> Paid. Nếu có ít nhất 1 người Paid -> Partial (hoặc giữ logic đơn giản của bạn)
        if (list.length > 0 && list[0].payrollId) { 
             // Cách chính xác nhất: Check status của bản ghi đầu tiên vì tất cả cùng 1 kỳ lương
             // Tuy nhiên trong DTO Dashboard, field status là của từng payslip hay payroll? 
             // Trong query SQL: p.status as status -> Là status của bảng Payroll cha.
             overallStatus = list[0].status; 
        }

        return {
            totalNet,
            totalGross,
            totalEmployees,
            paidEmployees,
            pendingCount,
            status: overallStatus
        };
    }
};