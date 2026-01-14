package com.example.demo.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data // Tự động sinh Getters, Setters, toString...
@NoArgsConstructor // Constructor không tham số (quan trọng cho Jackson parse JSON)
@AllArgsConstructor
public class FulltimePayslipCalculationRequest {

    // ID nhân viên cần tính lương
    private Long employeeId;

    // Tháng và năm để tính lương
    private Integer month;
    private Integer year;

    // Số ngày công thực tế (nếu muốn nhập tay, nếu không thì lấy mặc định trong
    // service)
    private Integer actualWorkDays;

    // Số giờ làm thêm (OT)
    private Double otHours;

    /**
     * Map chứa các khoản thưởng nhập tay.
     * Key: khớp với enum BonusType.key (ví dụ: "holiday", "other")
     * Value: số tiền (ví dụ: 900000)
     * Ví dụ JSON gửi lên:
     * "bonuses": {
     * "holiday": 900000,
     * "other": 200000
     * }
     */
    private Map<String, BigDecimal> bonuses;
}
