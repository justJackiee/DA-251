package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;
import com.example.demo.entity.subtable.FulltimeContractAllowance;
import com.example.demo.entity.subtable.FulltimeContractBonus;
import com.example.demo.entity.subtable.FulltimeContractDeduction;

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

    @Column(name = "standard_work_days")
    private Double standardWorkDays;

    @Column(name = "annual_leave_days")
    private Integer annualLeaveDays;

    @Column(name = "type", columnDefinition = "text")
    private String type;

    @Column(name = "document_path")
    private String documentPath;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "contract_id")
    private List<FulltimeContractAllowance> allowances;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "contract_id")
    private List<FulltimeContractBonus> bonuses;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "contract_id")
    private List<FulltimeContractDeduction> deductions;
}