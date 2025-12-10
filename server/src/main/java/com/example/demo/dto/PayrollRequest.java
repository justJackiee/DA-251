package com.example.demo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class PayrollRequest {
    private int month;
    private int year;
    
    // Danh sách các nhân viên được chọn tính lương kèm thông tin nhập tay
    // Nếu list này null hoặc rỗng -> Tính cho toàn bộ nhân viên (mặc định không thưởng)
    private List<EmployeeInput> employeeInputs;

    @Data
    public static class EmployeeInput {
        private Long employeeId;
        private Double otHours; // Nhập tay OT nếu chưa có module Timesheet xịn
        private Map<String, BigDecimal> bonuses; // Key: "holiday", "other"... Value: Số tiền
    }
}