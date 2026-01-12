package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.math.BigDecimal; // Import quan trọng
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayslipDetailDTO {

    private Long payslipId;
    private Long payrollId;
    private Long employeeId;

    // Đổi tên biến cho khớp với code Service (setFullName)
    private String fullName;
    private String bankAccountNumber;

    private BigDecimal baseSalary;
    
    // Thêm 2 trường này (dùng BigDecimal để khớp với Entity)
    private BigDecimal grossSalary;
    private BigDecimal netSalary;

    // Các list chi tiết
    private List<Map<String, Object>> allowances;
    private List<Map<String, Object>> bonuses;
    private List<Map<String, Object>> deductions; //deduction for fulltime, penalty for freelance
}