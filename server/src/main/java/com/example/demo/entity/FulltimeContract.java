package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "fulltime_contract")
@Data
public class FulltimeContract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contract_id")
    private Long contractId;

    @Column(name = "employee_id")
    private Long employeeId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "base_salary")
    private Double baseSalary;

    @Column(name = "ot_rate")
    private Double otRate;

    @Column(name = "annual_leave_days")
    private Integer annualLeaveDays;

    @Column(name = "type", columnDefinition = "text")
    private String type; 

    @Column(name = "document_path")
    private String documentPath;

    @Column(name = "allowances_json", columnDefinition = "TEXT")
    private String allowancesJson;

    @Column(name = "bonuses_json", columnDefinition = "TEXT")
    private String bonusesJson;

    @Column(name = "deductions_json", columnDefinition = "TEXT")
    private String deductionsJson;
}