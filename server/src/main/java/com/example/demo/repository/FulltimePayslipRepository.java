package com.example.demo.repository;

import com.example.demo.dto.PayslipHistoryDTO;
import com.example.demo.entity.FulltimePayslip;
import com.example.demo.entity.FulltimePayslipView;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FulltimePayslipRepository extends JpaRepository<FulltimePayslip, Long> {

    @Query(value = """
        SELECT 
            p.month as month, 
            p.year as year, 
            fp.net_salary as netPay,   -- Đổi tên cột này thành netPay để khớp DTO
            p.status as status
        FROM fulltime_payslip fp
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
            fp.net_salary as netPay, 
            p.status as status
        FROM fulltime_payslip fp
        JOIN payroll p ON fp.payroll_id = p.id
        WHERE fp.employee_id = :empId
        ORDER BY p.year DESC, p.month DESC
        LIMIT 1
    """, nativeQuery = true)
    List<PayslipHistoryDTO> findLatest(@Param("empId") Long empId);

    // Hàm JPA chuẩn để tìm kiếm (Dùng để check duplicate khi tính lương)
    Optional<FulltimePayslip> findByPayrollIdAndEmployeeId(Long payrollId, Long employeeId);
}