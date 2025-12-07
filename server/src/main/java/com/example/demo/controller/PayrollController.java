package com.example.demo.controller;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.dto.PayslipDetailDTO;
import com.example.demo.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
// Cho phép React (localhost:3000) gọi API mà không bị chặn
@CrossOrigin(origins = "http://localhost:3000") 
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    // ==========================================
    // 1. API TÍNH LƯƠNG (Trigger Calculation)
    // Method: POST
    // ==========================================
    @PostMapping("/calculate")
    public ResponseEntity<String> calculatePayroll(
            @RequestParam int month, 
            @RequestParam int year) {
        try {
            payrollService.calculateMonthlyPayroll(month, year);
            return ResponseEntity.ok("Payroll calculation triggered successfully for " + month + "/" + year);
        } catch (Exception e) {
            e.printStackTrace(); // In lỗi ra console server để debug
            return ResponseEntity.internalServerError().body("Error calculating payroll: " + e.getMessage());
        }
    }

    // ==========================================
    // 2. API DASHBOARD (Lấy danh sách bảng lương)
    // Method: GET
    // ==========================================
    @GetMapping
    public ResponseEntity<List<PayrollDashboardDTO>> getDashboard(
            @RequestParam(defaultValue = "11") int month,
            @RequestParam(defaultValue = "2024") int year) {
        return ResponseEntity.ok(payrollService.getPayrollDashboard(month, year));
    }

    // ==========================================
    // 3. API CHI TIẾT LƯƠNG FULLTIME (Cho Popup)
    // Method: GET
    // ==========================================
    @GetMapping("/fulltime/{id}")
    public ResponseEntity<PayslipDetailDTO> getFulltimePayslip(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getFulltimeDetail(id));
    }

    // ==========================================
    // 4. API CHI TIẾT LƯƠNG FREELANCE (Cho Popup)
    // Method: GET
    // ==========================================
    @GetMapping("/freelance/{id}")
    public ResponseEntity<PayslipDetailDTO> getFreelancePayslip(@PathVariable Long id) {
        return ResponseEntity.ok(payrollService.getFreelanceDetail(id));
    }
}