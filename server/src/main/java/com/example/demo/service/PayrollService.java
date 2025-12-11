package com.example.demo.service;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // Tự động inject dependency (thay cho @Autowired thủ công)
public class PayrollService {

    private final PayrollRepository payrollRepo;
    private final FulltimePayslipViewRepository fulltimeViewRepo; // Repo mới cho View
    private final FreelancePayslipRepository freelanceRepo;
    private final EmployeeRepository employeeRepo;
    private final TimesheetRepository timesheetRepo;
    private final ObjectMapper objectMapper; // Jackson lib để xử lý JSON

    // ==========================================
    // PHẦN 1: TÍNH TOÁN LƯƠNG (BATCH JOB)
    // ==========================================
    private static final double STANDARD_HOURS_PER_DAY = 8.0;

    @Transactional
    public void calculateMonthlyPayroll(int month, int year) {
        // B1: Kiểm tra hoặc tạo bảng lương cha
        Integer payrollId = payrollRepo.findPayrollIdByMonthYear(month, year).orElse(null);

        if (payrollId == null) {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = YearMonth.of(year, month).atEndOfMonth();
            payrollRepo.createPayrollPeriod(month, year, start, end);
            payrollId = payrollRepo.findPayrollIdByMonthYear(month, year)
                    .orElseThrow(() -> new RuntimeException("Error creating payroll period"));
        }

        // B2: Lấy danh sách nhân viên Fulltime Active
        List<Employee> fulltimeEmployees = employeeRepo.findAllActiveFulltime();

        // B3: Vòng lặp tính lương
        for (Employee emp : fulltimeEmployees) {
            // a. Lấy tổng số giờ làm từ Timesheet
            Double totalHours = timesheetRepo.calculateTotalWorkedHours(emp.getId(), month, year);
            if (totalHours == null) totalHours = 0.0;

            // b. Quy đổi ra ngày công & OT
            int actualWorkDays = (int) (totalHours / STANDARD_HOURS_PER_DAY);
            
            // Hiện tại set cứng OT = 0, sau này lấy từ Timesheet nếu có tách cột OT
            BigDecimal otHours = BigDecimal.ZERO; 

            // c. Bonus mặc định là rỗng (Batch job chạy tự động chưa có input bonus tay)
            String manualBonusJson = "{}";

            // d. Gọi Repo (Lưu ý ép kiểu Long -> Integer cho khớp với Repo mới)
            payrollRepo.generateFulltimePayslip(
                payrollId,
                emp.getId().intValue(), // Cast Long to Integer
                actualWorkDays,
                otHours,
                manualBonusJson
            );
        }
    }
    
    // ==========================================
    // PHẦN 2: DASHBOARD
    // ==========================================
    public List<PayrollDashboardDTO> getPayrollDashboard(int month, int year) {
        List<Object[]> rawData = payrollRepo.findPayrollSummary(month, year);
        
        return rawData.stream().map(row -> new PayrollDashboardDTO(
            ((Number) row[0]).longValue(), // employeeId
            (String) row[1],               // fullName
            (String) row[2],               // department
            (String) row[3],               // role
            (BigDecimal) row[4],           // netPay
            (BigDecimal) row[5],           // netPay
            (String) row[6],               // status
            (Date) row[7],                 // paymentDate
            row[8] != null ? ((Number) row[8]).longValue() : null, // payslipId
            (String) row[9],               // contractType
            
            // [MỚI] Map cột thứ 9 (payrollId) vào DTO
            ((Number) row[10]).longValue()  
        )).collect(Collectors.toList());
    }

    // ==========================================
    // PHẦN 3: CHI TIẾT LƯƠNG FULLTIME (Dùng VIEW)
    // ==========================================
    public PayslipDetailDTO getFulltimeDetail(Long payrollId, Long employeeId) {
        // Sử dụng Repo của View thay vì Entity thường -> Hiệu năng cao & code gọn
        FulltimePayslipView view = fulltimeViewRepo.findByPayrollIdAndEmployeeId(payrollId, employeeId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));

        // Map dữ liệu từ View sang DTO
        PayslipDetailDTO dto = new PayslipDetailDTO();
        dto.setPayslipId(view.getPayslipId());
        dto.setPayrollId(view.getPayrollId());
        dto.setEmployeeId(view.getEmployeeId());
        dto.setFullName(view.getFullName());
        dto.setBankAccountNumber(view.getBankAccountNumber());
        dto.setGrossSalary(view.getGrossSalary());
        dto.setNetSalary(view.getNetSalary());

        // Parse JSON String thành List Map bằng Jackson
        try {
            dto.setAllowances(parseJsonToList(view.getAllowancesJson()));
            dto.setBonuses(parseJsonToList(view.getBonusesJson()));
            dto.setDeductions(parseJsonToList(view.getDeductionsJson()));
        } catch (Exception e) {
            e.printStackTrace();
            // Nếu lỗi parse thì trả về list rỗng để không chết API
            dto.setAllowances(new ArrayList<>());
            dto.setBonuses(new ArrayList<>());
            dto.setDeductions(new ArrayList<>());
        }

        return dto;
    }

    // Helper method để parse JSON
    private List<Map<String, Object>> parseJsonToList(String json) {
        if (json == null || json.isEmpty()) return new ArrayList<>();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (JsonProcessingException e) {
            System.err.println("Error parsing JSON: " + json);
            return new ArrayList<>();
        }
    }

    // ==========================================
    // PHẦN 4: CHI TIẾT LƯƠNG FREELANCE (Logic cũ adapt DTO mới)
    // ==========================================
    public PayslipDetailDTO getFreelanceDetail(Long payslipId) {
        FreelancePayslip payslip = freelanceRepo.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Freelance Payslip not found"));

        Employee emp = employeeRepo.findById(payslip.getEmployeeId())
                .orElse(new Employee());

        PayslipDetailDTO dto = new PayslipDetailDTO();
        
        dto.setPayslipId(payslip.getPayslipId());
        dto.setEmployeeId(emp.getId());
        dto.setFullName(emp.getFName() + " " + emp.getLName());
        dto.setBankAccountNumber(emp.getBankAccountNumber());
        dto.setGrossSalary(payslip.getFinalAmount());
        dto.setNetSalary(payslip.getFinalAmount()); // Freelance thường gross = net nếu chưa tính thuế ở đây

        // Map thủ công các list cũ sang List<Map<String, Object>>
        dto.setAllowances(new ArrayList<>()); // Freelance không có allowances

        // Map Bonuses
        List<Map<String, Object>> bonusList = new ArrayList<>();
        if (payslip.getBonuses() != null) {
            for (var b : payslip.getBonuses()) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", b.getName());
                item.put("amount", b.getAmount());
                bonusList.add(item);
            }
        }
        dto.setBonuses(bonusList);

        // Map Deductions (Penalties)
        List<Map<String, Object>> deductionList = new ArrayList<>();
        if (payslip.getPenalties() != null) {
            for (var p : payslip.getPenalties()) {
                Map<String, Object> item = new HashMap<>();
                item.put("name", p.getName());
                item.put("amount", p.getAmount());
                deductionList.add(item);
            }
        }
        dto.setDeductions(deductionList);

        return dto;
    }

    // ==========================================
    // PHẦN 5: LOCK PHIẾU LƯƠNG
    // ==========================================
    public void lockPayroll(Integer payrollId) {
        // Kiểm tra xem kỳ lương có tồn tại không
        if (!payrollRepo.existsById(payrollId)) {
            throw new RuntimeException("Payroll ID " + payrollId + " not found.");
        }
        // Cập nhật trạng thái
        payrollRepo.updateStatus(payrollId, "Paid");
    }
}