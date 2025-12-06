package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class PayslipDetailDTO {
    // Header
    private String employeeName;
    private String period; // e.g., "May 2025"
    
    // Body
    private BigDecimal grossSalary;
    private BigDecimal netSalary;
    
    // Các danh sách chi tiết (Cấu trúc linh động cho cả Fulltime/Freelance)
    private List<Item> allowances;
    private List<Item> bonuses;
    private List<Item> deductions;

    @Data
    @lombok.AllArgsConstructor
    public static class Item {
        private String name;
        private BigDecimal amount;
    }
}