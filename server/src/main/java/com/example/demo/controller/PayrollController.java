package com.example.demo.controller;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayrollRequest;
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.enums.BonusType;
import com.example.demo.service.PayrollService;
import com.example.demo.repository.TimesheetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*") // Cho phép tất cả nguồn (giống EmployeeController)
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;
    private final TimesheetRepository timesheetRepo;

    // =========================================================================
    // 0. METADATA: Lấy danh sách loại thưởng (Cho Dropdown FE)
    // =========================================================================
    @GetMapping("/metadata/bonus-types")
    public ResponseEntity<List<Map<String, String>>> getBonusTypes() {
        List<Map<String, String>> types = Arrays.stream(BonusType.values())
                .filter(t -> t == BonusType.HOLIDAY || t == BonusType.OTHER)
                .map(type -> Map.of("key", type.getKey(), "label", type.getLabel()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    // =========================================================================
    // 1. DASHBOARD: Lấy danh sách bảng lương
    // =========================================================================
    @GetMapping
    public ResponseEntity<List<PayrollDashboardDTO>> getDashboard(
            @RequestParam(defaultValue = "11") int month,
            @RequestParam(defaultValue = "2024") int year) {
        
        List<PayrollDashboardDTO> dashboardData = payrollService.getPayrollDashboard(month, year);
        return ResponseEntity.ok(dashboardData);
    }

    // =========================================================================
    // 2. CALCULATION: Tính lương (Unified Endpoint)
    // API này dùng cho cả: "Tính tất cả", "Tính lại 1 người", "Fulltime", "Freelance"
    // =========================================================================
    @PostMapping("/calculate")
    public ResponseEntity<?> calculatePayroll(@RequestBody PayrollRequest request) {
        try {
            // Validation cơ bản
            if (request.getMonth() < 1 || request.getMonth() > 12) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid month"));
            }

            // Gọi Service xử lý logic định tuyến
            payrollService.calculatePayroll(request);

            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Payroll calculation completed successfully for " + request.getMonth() + "/" + request.getYear()
            ));

        } catch (RuntimeException e) {
            // Lỗi logic (ví dụ: Payroll Locked)
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Server Error: " + e.getMessage()));
        }
    }

    // =========================================================================
    // 3. DETAIL: Xem chi tiết phiếu lương (Unified Endpoint)
    // Tự động trả về cấu trúc đúng cho Fulltime hoặc Freelance
    // =========================================================================
    @GetMapping("/{payrollId}/employee/{employeeId}")
    public ResponseEntity<?> getPayslipDetail(
            @PathVariable Long payrollId,
            @PathVariable Long employeeId) {
        try {
            PayslipDetailDTO detail = payrollService.getPayslipDetail(payrollId, employeeId);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // =========================================================================
    // 4. LOCK: Chốt sổ kỳ lương
    // =========================================================================
    @PostMapping("/{payrollId}/lock")
    public ResponseEntity<?> lockPayroll(@PathVariable Integer payrollId) {
        try {
            payrollService.lockPayroll(payrollId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Payroll locked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // =========================================================================
    // 5. TIMESHEET SUMMARY: Lấy thông tin công/OT cho Modal (Read-only)
    // =========================================================================
    @GetMapping("/timesheet-summary")
    public ResponseEntity<Map<String, Object>> getTimesheetSummary(
            @RequestParam Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        
        Double totalHours = timesheetRepo.calculateTotalWorkedHours(employeeId, month, year);
        Double totalOT = timesheetRepo.calculateTotalOvertimeHours(employeeId, month, year);
        
        int workDays = (totalHours != null) ? (int) (totalHours / 8.0) : 0;
        double ot = (totalOT != null) ? totalOT : 0.0;

        return ResponseEntity.ok(Map.of(
            "actualWorkDays", workDays,
            "suggestedOtHours", ot
        ));
    }
    // =========================================================================
    // 6. FREELANCE TERMS: Lấy danh sách thưởng/phạt từ hợp đồng (theo tháng/năm)
    // =========================================================================
    @GetMapping("/freelance-contract-terms")
    public ResponseEntity<Map<String, List<com.example.demo.dto.FreelanceContractTerm>>> getFreelanceTerms(
            @RequestParam Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {
        
        try {
            var terms = payrollService.getFreelanceContractTerms(employeeId, month, year);
            return ResponseEntity.ok(terms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}