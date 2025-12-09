package com.example.demo.controller;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayslipCalculationRequest; // Nếu bạn định dùng nhập liệu sau này
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.enums.BonusType; // Import Enum
import com.example.demo.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor // Tự động inject PayrollService
public class PayrollController {

    private final PayrollService payrollService;

    // ==========================================
    // 0. API METADATA (Cho Dropdown FE)
    // ==========================================
    @GetMapping("/metadata/bonus-types")
    public ResponseEntity<List<Map<String, String>>> getBonusTypes() {
        // Trả về danh sách Enum cho FE render Dropdown
        // Kết quả: [{"key": "holiday", "label": "Holiday Bonus"}, ...]
        List<Map<String, String>> types = Arrays.stream(BonusType.values())
            .map(type -> Map.of("key", type.getKey(), "label", type.getLabel()))
            .collect(Collectors.toList());
        return ResponseEntity.ok(types);
    }

    // ==========================================
    // 1. API TÍNH LƯƠNG (Trigger Calculation)
    // ==========================================
    @PostMapping("/calculate")
    public ResponseEntity<String> calculatePayroll(
            @RequestParam int month, 
            @RequestParam int year) {
        try {
            payrollService.calculateMonthlyPayroll(month, year);
            return ResponseEntity.ok("Payroll calculation triggered successfully for " + month + "/" + year);
        } catch (RuntimeException e) {
            // Bắt lỗi logic (ví dụ: đã Paid rồi thì không tính lại)
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error calculating payroll: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. API DASHBOARD (Lấy danh sách bảng lương)
    // ==========================================
    @GetMapping
    public ResponseEntity<List<PayrollDashboardDTO>> getDashboard(
            @RequestParam(defaultValue = "11") int month,
            @RequestParam(defaultValue = "2024") int year) {
        return ResponseEntity.ok(payrollService.getPayrollDashboard(month, year));
    }

    // ==========================================
    // 3. API CHI TIẾT LƯƠNG FULLTIME (Updated)
    // Lưu ý: Đổi Route để khớp với Service getFulltimeDetail(payrollId, employeeId)
    // ==========================================
    @GetMapping("/{payrollId}/employee/{employeeId}")
    public ResponseEntity<PayslipDetailDTO> getFulltimePayslip(
            @PathVariable Long payrollId,
            @PathVariable Long employeeId) {
        return ResponseEntity.ok(payrollService.getFulltimeDetail(payrollId, employeeId));
    }

    // ==========================================
    // 4. API CHI TIẾT LƯƠNG FREELANCE
    // ==========================================
    @GetMapping("/freelance/{id}")
    public ResponseEntity<PayslipDetailDTO> getFreelancePayslip(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getFreelanceDetail(id));
    }

    // ==========================================
    // 5. API LOCK PHIẾU LƯƠNG
    // ==========================================
    @PostMapping("/{payrollId}/lock")
    public ResponseEntity<?> lockPayroll(@PathVariable Integer payrollId) {
        try {
            payrollService.lockPayroll(payrollId);
            return ResponseEntity.ok("Payroll locked successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error locking payroll: " + e.getMessage());
        }
    }
}