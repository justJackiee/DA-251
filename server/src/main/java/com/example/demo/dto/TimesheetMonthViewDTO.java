package com.example.demo.dto;

import lombok.Data;
import java.util.Map;

@Data
public class TimesheetMonthViewDTO {
    private int employeeId;
    private String employeeName;
    private String employeeType;
    private double totalHours;
    private double totalOvertime;
    private Map<String, String> days; // "2025-12-05" : "08:00-17:00"
}
