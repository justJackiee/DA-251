package com.example.demo.service;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayrollRequest;
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PayrollService {

    private final PayrollRepository payrollRepo;
    private final FulltimePayslipViewRepository fulltimeViewRepo;
    private final FreelancePayslipViewRepository freelanceViewRepo;
    private final EmployeeRepository employeeRepo;
    private final TimesheetRepository timesheetRepo;
    private final ObjectMapper objectMapper;
    private final FreelanceContractRepository freelanceContractRepo;

    private static final double STANDARD_HOURS_PER_DAY = 8.0;

    // =========================================================================
    // 1. DASHBOARD
    // =========================================================================
    public List<PayrollDashboardDTO> getPayrollDashboard(int month, int year) {
        List<Object[]> rawData = payrollRepo.findPayrollSummary(month, year);
        return rawData.stream().map(row -> new PayrollDashboardDTO(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                (String) row[3],
                (BigDecimal) row[4],
                (BigDecimal) row[5],
                (String) row[6],
                (Date) row[7],
                row[8] != null ? ((Number) row[8]).longValue() : null,
                (String) row[9],
                ((Number) row[10]).longValue())).collect(Collectors.toList());
    }

    // =========================================================================
    // 2. CORE CALCULATION
    // =========================================================================
    @Transactional
    public void calculatePayroll(PayrollRequest request) {
        int month = request.getMonth();
        int year = request.getYear();
        Integer payrollId = ensurePayrollPeriodExists(month, year);
        List<PayrollRequest.EmployeeInput> inputs = request.getEmployeeInputs();

        if (inputs == null || inputs.isEmpty()) {
            inputs = fetchAllActiveEmployeesForCalculation();
        }

        for (PayrollRequest.EmployeeInput input : inputs) {
            try {
                processSingleEmployee(payrollId, input, month, year);
            } catch (Exception e) {
                log.error("Error calculating payroll for empId: " + input.getEmployeeId(), e);
            }
        }
    }

    private void processSingleEmployee(Integer payrollId, PayrollRequest.EmployeeInput input, int month, int year)
            throws JsonProcessingException {
        Long empId = input.getEmployeeId();
        String type = employeeRepo.findTypeById(empId);
        if (type == null)
            return;

        if ("Fulltime".equalsIgnoreCase(type)) {
            // [LOGIC FULLTIME CẬP NHẬT]

            // 1. Tính ngày công từ Timesheet
            Double totalHours = timesheetRepo.calculateTotalWorkedHours(empId, month, year);
            int actualWorkDays = (totalHours != null) ? (int) (totalHours / STANDARD_HOURS_PER_DAY) : 0;

            // 2. Tính OT Hours TỰ ĐỘNG TỪ DB (Bỏ qua input nhập tay)
            Double totalOT = timesheetRepo.calculateTotalOvertimeHours(empId, month, year);
            BigDecimal otHours = BigDecimal.valueOf(totalOT != null ? totalOT : 0.0);

            // 3. Manual Bonus
            String bonusJson = "{}";
            if (input.getFulltimeManualBonuses() != null && !input.getFulltimeManualBonuses().isEmpty()) {
                bonusJson = objectMapper.writeValueAsString(input.getFulltimeManualBonuses());
            }

            // 4. Gọi Procedure
            payrollRepo.generateFulltimePayslip(
                    payrollId,
                    empId.intValue(),
                    actualWorkDays,
                    otHours, // Giá trị từ DB
                    bonusJson);

        } else if ("Freelance".equalsIgnoreCase(type)) {
            // Logic Freelance giữ nguyên (Selection)
            Map<String, List<String>> adjustmentsMap = new HashMap<>();
            adjustmentsMap.put("bonuses",
                    input.getFreelanceSelectedBonuses() != null ? input.getFreelanceSelectedBonuses()
                            : new ArrayList<>());
            adjustmentsMap.put("penalties",
                    input.getFreelanceSelectedPenalties() != null ? input.getFreelanceSelectedPenalties()
                            : new ArrayList<>());

            String adjustmentsJson = objectMapper.writeValueAsString(adjustmentsMap);

            payrollRepo.generateFreelancePayslip(
                    payrollId,
                    empId.intValue(),
                    adjustmentsJson);
        }
    }

    // =========================================================================
    // 3. MANUAL CALCULATION (Gọi từ nút "Tính thử" UI)
    // =========================================================================
    @Transactional
    public void calculateFulltimePayslip(Long employeeId, int month, int year, Integer actualWorkDays, Double otHours,
            Map<String, Double> bonuses) {
        Integer payrollId = ensurePayrollPeriodExists(month, year);

        // Nếu FE không truyền workDays, tự tính từ Timesheet
        int workDays = 0;
        if (actualWorkDays != null) {
            workDays = actualWorkDays;
        } else {
            Double totalHours = timesheetRepo.calculateTotalWorkedHours(employeeId, month, year);
            if (totalHours != null) {
                workDays = (int) (totalHours / STANDARD_HOURS_PER_DAY);
            }
        }

        String bonusJson = "{}";
        try {
            if (bonuses != null && !bonuses.isEmpty()) {
                bonusJson = objectMapper.writeValueAsString(bonuses);
            }
        } catch (Exception e) {
            throw new RuntimeException("JSON error", e);
        }

        payrollRepo.generateFulltimePayslip(
                payrollId,
                employeeId.intValue(),
                workDays,
                BigDecimal.valueOf(otHours != null ? otHours : 0.0),
                bonusJson);
    }

    // =========================================================================
    // 4. COMMON HELPERS & VIEWS
    // =========================================================================

    public Map<String, List<com.example.demo.dto.FreelanceContractTerm>> getFreelanceContractTerms(Long empId,
            int month, int year) {
        // 1. Xác định thời điểm cần lấy dữ liệu (Lấy ngày cuối tháng của kỳ lương đó)
        LocalDate targetDate = LocalDate.of(year, month, 1).plusMonths(1).minusDays(1);

        // 2. Tìm hợp đồng Valid tại thời điểm đó
        FreelanceContract contract = freelanceContractRepo.findValidContractAtDate(empId, targetDate)
                .orElse(null);

        Map<String, List<com.example.demo.dto.FreelanceContractTerm>> result = new HashMap<>();
        result.put("bonuses", new ArrayList<>());
        result.put("penalties", new ArrayList<>());

        if (contract == null) {
            return result; // Trả về list rỗng nếu không tìm thấy hợp đồng vào thời điểm đó
        }

        // 3. Map Bonuses
        List<Object[]> bonuses = freelanceContractRepo.findBonusesByContractId(contract.getContractId());
        for (Object[] row : bonuses) {
            String name = (String) row[0];
            BigDecimal amount = row[1] != null ? (BigDecimal) row[1] : null;
            BigDecimal rate = row[2] != null ? (BigDecimal) row[2] : null;

            result.get("bonuses").add(new com.example.demo.dto.FreelanceContractTerm(name, amount, rate, "BONUS"));
        }

        // 4. Map Penalties
        List<Object[]> penalties = freelanceContractRepo.findPenaltiesByContractId(contract.getContractId());
        for (Object[] row : penalties) {
            String name = (String) row[0];
            BigDecimal amount = row[1] != null ? (BigDecimal) row[1] : null;
            BigDecimal rate = row[2] != null ? (BigDecimal) row[2] : null;

            result.get("penalties").add(new com.example.demo.dto.FreelanceContractTerm(name, amount, rate, "PENALTY"));
        }

        return result;
    }

    public PayslipDetailDTO getPayslipDetail(Long payrollId, Long employeeId) {
        String type = employeeRepo.findTypeById(employeeId);
        if ("Fulltime".equalsIgnoreCase(type)) {
            return getFulltimeDetail(payrollId, employeeId);
        } else if ("Freelance".equalsIgnoreCase(type)) {
            return getFreelanceDetail(payrollId, employeeId);
        }
        throw new RuntimeException("Employee type not supported");
    }

    private PayslipDetailDTO getFulltimeDetail(Long payrollId, Long employeeId) {
        FulltimePayslipView view = fulltimeViewRepo.findByPayrollIdAndEmployeeId(payrollId, employeeId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));
        PayslipDetailDTO dto = PayslipDetailDTO.builder()
                .payslipId(view.getPayslipId())
                .payrollId(view.getPayrollId())
                .employeeId(view.getEmployeeId())
                .fullName(view.getFullName())
                .bankAccountNumber(view.getBankAccountNumber())
                .baseSalary(view.getBaseSalary())
                .grossSalary(view.getGrossSalary())
                .netSalary(view.getNetSalary())
                .build();
        dto.setAllowances(parseJsonToList(view.getAllowancesJson()));
        dto.setBonuses(parseJsonToList(view.getBonusesJson()));
        dto.setDeductions(parseJsonToList(view.getDeductionsJson()));
        return dto;
    }

    private PayslipDetailDTO getFreelanceDetail(Long payrollId, Long employeeId) {
        FreelancePayslipView view = freelanceViewRepo.findByPayrollIdAndEmployeeId(payrollId, employeeId)
                .orElseThrow(() -> new RuntimeException("Payslip not found"));
        PayslipDetailDTO dto = PayslipDetailDTO.builder()
                .payslipId(view.getPayslipId())
                .payrollId(view.getPayrollId())
                .employeeId(view.getEmployeeId())
                .fullName(view.getFullName())
                .bankAccountNumber(view.getBankAccountNumber())
                .grossSalary(view.getFinalAmount())
                .netSalary(view.getFinalAmount())
                .allowances(new ArrayList<>())
                .build();
        dto.setBonuses(parseJsonToList(view.getBonusesJson()));
        dto.setDeductions(parseJsonToList(view.getPenaltiesJson()));
        return dto;
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseJsonToList(String json) {
        if (json == null || json.isEmpty() || "[]".equals(json))
            return new ArrayList<>();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (JsonProcessingException e) {
            log.error("JSON Parsing error", e);
            return new ArrayList<>();
        }
    }

    @Transactional
    public void lockPayroll(Integer payrollId) {
        if (!payrollRepo.existsById(payrollId)) {
            throw new RuntimeException("Payroll ID not found");
        }
        payrollRepo.updateStatus(payrollId, "Paid");
    }

    private Integer ensurePayrollPeriodExists(int month, int year) {
        return payrollRepo.findPayrollIdByMonthYear(month, year)
                .orElseGet(() -> {
                    LocalDate start = LocalDate.of(year, month, 1);
                    LocalDate end = YearMonth.of(year, month).atEndOfMonth();
                    payrollRepo.createPayrollPeriod(month, year, start, end);
                    return payrollRepo.findPayrollIdByMonthYear(month, year)
                            .orElseThrow(() -> new RuntimeException("Failed to create payroll period"));
                });
    }

    private List<PayrollRequest.EmployeeInput> fetchAllActiveEmployeesForCalculation() {
        List<PayrollRequest.EmployeeInput> inputs = new ArrayList<>();
        List<Employee> fulltimeEmps = employeeRepo.findAllActiveFulltime();
        for (Employee e : fulltimeEmps) {
            PayrollRequest.EmployeeInput input = new PayrollRequest.EmployeeInput();
            input.setEmployeeId(e.getId());
            input.setFulltimeManualBonuses(new HashMap<>());
            inputs.add(input);
        }
        List<Employee> freelanceEmps = employeeRepo.findAllActiveFreelance();
        for (Employee e : freelanceEmps) {
            PayrollRequest.EmployeeInput input = new PayrollRequest.EmployeeInput();
            input.setEmployeeId(e.getId());
            input.setFreelanceSelectedBonuses(new ArrayList<>());
            input.setFreelanceSelectedPenalties(new ArrayList<>());
            inputs.add(input);
        }
        return inputs;
    }
}