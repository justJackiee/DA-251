
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

    // 1. LẤY LỊCH SỬ (5 tháng gần nhất, trừ tháng hiện tại)
    @Query(value = """
        SELECT 
            p.month as "month", 
            p.year as "year", 
            -- [MỚI] Nối chuỗi Month/Year
            (CAST(p.month AS TEXT) || '/' || CAST(p.year AS TEXT)) as "monthYear",
            
            fp.net_salary as "netPay", -- "netPay" để khớp DTO
            p.status as "status"
        FROM fulltime_payslip fp
        JOIN payroll p ON fp.payroll_id = p.id
        WHERE fp.employee_id = :empId
        ORDER BY p.year DESC, p.month DESC
        LIMIT 5 OFFSET 1
    """, nativeQuery = true)
    List<PayslipHistoryDTO> findHistory(@Param("empId") Long empId);

    // 2. LẤY LƯƠNG MỚI NHẤT (Cho Dashboard)
    @Query(value = """
        SELECT 
            p.month as "month", 
            p.year as "year", 
            -- [MỚI] Nối chuỗi Month/Year
            (CAST(p.month AS TEXT) || '/' || CAST(p.year AS TEXT)) as "monthYear",
            
            fp.net_salary as "netPay", 
            p.status as "status"
        FROM fulltime_payslip fp
        JOIN payroll p ON fp.payroll_id = p.id
        WHERE fp.employee_id = :empId
        ORDER BY p.year DESC, p.month DESC
        LIMIT 1
    """, nativeQuery = true)
    List<PayslipHistoryDTO> findLatest(@Param("empId") Long empId);

    // 3. LẤY CHI TIẾT (Dùng View SQL)
    // Lưu ý: Entity FulltimePayslipView cần map đúng các cột JSON (allowances_json, bonuses_json...)
    @Query(value = "SELECT * FROM view_fulltime_payslip_detail WHERE payslip_id = :id", nativeQuery = true)
    Optional<FulltimePayslipView> findDetailView(@Param("id") Long id);

    // Hàm JPA chuẩn
    Optional<FulltimePayslip> findByPayrollIdAndEmployeeId(Long payrollId, Long employeeId);
}