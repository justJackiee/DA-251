package com.example.demo.repository;

import com.example.demo.entity.FreelancePayslip;
import com.example.demo.entity.PayslipHistoryDTO; // Import DTO từ package entity
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreelancePayslipRepository extends JpaRepository<FreelancePayslip, Long> {

    @Query(value = """
        SELECT 
            p.month as month, 
            p.year as year, 
            fp.final_amount as netPay, -- Đổi tên cột này thành netPay để khớp DTO
            p.status as status
        FROM freelance_payslip fp
        JOIN payroll p ON fp.payroll_id = p.id
        WHERE fp.employee_id = :empId
        ORDER BY p.year DESC, p.month DESC
        LIMIT 5 OFFSET 1
    """, nativeQuery = true)
    List<PayslipHistoryDTO> findHistory(@Param("empId") Long empId);

    @Query(value = """
        SELECT 
            p.month as month, 
            p.year as year, 
            fp.final_amount as netPay, 
            p.status as status
        FROM freelance_payslip fp
        JOIN payroll p ON fp.payroll_id = p.id
        WHERE fp.employee_id = :empId
        ORDER BY p.year DESC, p.month DESC
        LIMIT 1
    """, nativeQuery = true)
    List<PayslipHistoryDTO> findLatest(@Param("empId") Long empId);
}