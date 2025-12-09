package com.example.demo.service;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepo; // Repo chứa query Native Dashboard

    @Autowired
    private FulltimePayslipRepository fulltimeRepo;

    @Autowired
    private FreelancePayslipRepository freelanceRepo;

    @Autowired
    private EmployeeRepository employeeRepo; // Để lấy tên nhân viên khi xem chi tiết

    @Autowired private TimesheetRepository timesheetRepo;

    // ==========================================
    // PHẦN 0: TÍNH TOÁN LƯƠNG
    // ==========================================
    private static final double STANDARD_HOURS_PER_DAY = 8.0;

    @Transactional
    public void calculateMonthlyPayroll(int month, int year) {
        // B1: Kiểm tra hoặc tạo bảng lương cha (Payroll Period)
        Long payrollId = payrollRepo.findPayrollIdByMonthYear(month, year);

        if (payrollId == null) {
            LocalDate start = LocalDate.of(year, month, 1);
            LocalDate end = YearMonth.of(year, month).atEndOfMonth();
            payrollRepo.createPayrollPeriod(month, year, start, end);
            payrollId = payrollRepo.findPayrollIdByMonthYear(month, year);
        }

        // B2: Lấy danh sách nhân viên Fulltime đang Active
        List<Employee> fulltimeEmployees = employeeRepo.findAllActiveFulltime();

        // B3: Vòng lặp tính lương
        for (Employee emp : fulltimeEmployees) {
            // a. Lấy tổng số giờ làm việc thực tế từ Timesheet (Trả về Double)
            Double totalHours = timesheetRepo.calculateTotalWorkedHours(emp.getId(), month, year);
            if (totalHours == null) totalHours = 0.0;

            // b. QUY ĐỔI & LÀM TRÒN XUỐNG
            // Ví dụ: Làm 207 tiếng. 207 / 8 = 25.875 -> Ép kiểu (int) sẽ tự động cắt bỏ phần thập phân -> 25 ngày.
            int actualWorkDays = (int) (totalHours / STANDARD_HOURS_PER_DAY);

            // c. Chuẩn bị tham số khác
            BigDecimal otValue = BigDecimal.ZERO; 
            BigDecimal otherDeduction = BigDecimal.ZERO;
            String manualBonusJson = "{}";

            // d. Gọi Repo (Lưu ý: Repo phải nhận tham số workDays là Integer)
            payrollRepo.generateFulltimePayslip(
                payrollId,
                emp.getId(),
                actualWorkDays, // Truyền số nguyên vào đây
                otValue,
                otherDeduction,
                manualBonusJson
            );
        }
    }
    
    // --- 1. LOGIC DASHBOARD ---
    public List<PayrollDashboardDTO> getPayrollDashboard(int month, int year) {
        List<Object[]> rawData = payrollRepo.findPayrollSummary(month, year);
        
        return rawData.stream().map(row -> new PayrollDashboardDTO(
            ((Number) row[0]).longValue(), // employeeId
            (String) row[1],               // fullName
            (String) row[2],               // department
            (String) row[3],               // role
            (BigDecimal) row[4],           // netPay
            (String) row[5],               // status
            (Date) row[6],                 // paymentDate (Lưu ý: Driver Postgres trả về java.sql.Date là con của java.util.Date nên cast OK)
            row[7] != null ? ((Number) row[7]).longValue() : null, // payslipId
            (String) row[8]                // contractType
        )).collect(Collectors.toList());
    }

    // --- 2. LOGIC CHI TIẾT FULLTIME ---
    public PayslipDetailDTO getFulltimeDetail(Long payslipId) {
        // Lấy Payslip từ DB
        FulltimePayslip payslip = fulltimeRepo.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Payslip not found with id: " + payslipId));

        // Lấy thông tin Employee
        Employee emp = employeeRepo.findById(payslip.getEmployeeId())
                .orElse(new Employee());

        PayslipDetailDTO dto = new PayslipDetailDTO();
        
        // Map Header
        dto.setEmployeeName(emp.getFName() + " " + emp.getLName());
        // Lấy tháng/năm từ bảng Payroll cha (nếu có quan hệ) hoặc hardcode tạm/query thêm
        // Ở đây tạm thời để chuỗi demo hoặc bạn cần query bảng Payroll theo payslip.getPayrollId()
        dto.setPeriod("Period Info"); 

        // Map Body
        dto.setGrossSalary(payslip.getGrossSalary());
        dto.setNetSalary(payslip.getNetSalary());

        // Map Lists (Convert từ Entity con sang DTO Item)
        // 1. Allowances
        List<PayslipDetailDTO.Item> allowanceItems = new ArrayList<>();
        if (payslip.getAllowances() != null) {
            allowanceItems = payslip.getAllowances().stream()
                .map(a -> new PayslipDetailDTO.Item(a.getName(), a.getAmount()))
                .collect(Collectors.toList());
        }
        dto.setAllowances(allowanceItems);

        // 2. Bonuses
        List<PayslipDetailDTO.Item> bonusItems = new ArrayList<>();
        if (payslip.getBonuses() != null) {
            bonusItems = payslip.getBonuses().stream()
                .map(b -> new PayslipDetailDTO.Item(b.getName(), b.getAmount()))
                .collect(Collectors.toList());
        }
        dto.setBonuses(bonusItems);

        // 3. Deductions
        List<PayslipDetailDTO.Item> deductionItems = new ArrayList<>();
        if (payslip.getDeductions() != null) {
            deductionItems = payslip.getDeductions().stream()
                .map(d -> new PayslipDetailDTO.Item(d.getName(), d.getAmount()))
                .collect(Collectors.toList());
        }
        dto.setDeductions(deductionItems);

        return dto;
    }

    // --- 3. LOGIC CHI TIẾT FREELANCE ---
    public PayslipDetailDTO getFreelanceDetail(Long payslipId) {
        FreelancePayslip payslip = freelanceRepo.findById(payslipId)
                .orElseThrow(() -> new RuntimeException("Freelance Payslip not found"));

        Employee emp = employeeRepo.findById(payslip.getEmployeeId())
                .orElse(new Employee());

        PayslipDetailDTO dto = new PayslipDetailDTO();
        
        dto.setEmployeeName(emp.getFName() + " " + emp.getLName());
        dto.setPeriod("Project Based");
        dto.setGrossSalary(payslip.getFinalAmount()); // Freelance coi Gross = Net = Final
        dto.setNetSalary(payslip.getFinalAmount());

        // Freelance không có Allowance
        dto.setAllowances(new ArrayList<>());

        // Bonuses
        List<PayslipDetailDTO.Item> bonusItems = new ArrayList<>();
        if (payslip.getBonuses() != null) {
            bonusItems = payslip.getBonuses().stream()
                .map(b -> new PayslipDetailDTO.Item(b.getName(), b.getAmount()))
                .collect(Collectors.toList());
        }
        dto.setBonuses(bonusItems);

        // Deductions (Map Penalty của Freelance vào mục Deductions của DTO để hiển thị)
        List<PayslipDetailDTO.Item> deductionItems = new ArrayList<>();
        if (payslip.getPenalties() != null) {
            deductionItems = payslip.getPenalties().stream()
                .map(p -> new PayslipDetailDTO.Item(p.getName(), p.getAmount()))
                .collect(Collectors.toList());
        }
        dto.setDeductions(deductionItems);

        return dto;
    }
}