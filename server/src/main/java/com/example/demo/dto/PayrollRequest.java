package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class PayrollRequest {
    private int month;
    private int year;
    
    private List<EmployeeInput> employeeInputs;

    @Data
    public static class EmployeeInput {
        private Long employeeId;
        private Map<String, BigDecimal> fulltimeManualBonuses; // Key: "holiday", "other"... 
        
        // Freelance Selection
        private List<String> freelanceSelectedBonuses;
        private List<String> freelanceSelectedPenalties;
    }
}