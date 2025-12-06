package com.example.demo.entity.subtable;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "fulltime_payslip_deduction")
@Data
public class FulltimePayslipDeduction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Hibernate cần ID, dù DB dùng Composite Key (tạm thời để vậy cho đơn giản)

    @Column(name = "payslip_id")
    private Long payslipId;

    private Integer stt;
    private String name;
    private BigDecimal amount;
}