package com.example.demo.entity.subtable;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "freelance_actual_bonus")
@Data
public class FreelanceActualPenalty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payslip_id")
    private Long payslipId;

    private Integer stt;
    private String name;
    private BigDecimal amount;
}

