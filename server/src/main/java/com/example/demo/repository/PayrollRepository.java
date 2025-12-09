package com.example.demo.repository;

import com.example.demo.dto.PayrollDashboardDTO;
import com.example.demo.entity.FulltimePayslip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying; // Import này
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // Import này

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<FulltimePayslip, Long> {

    @Query(value = """
        SELECT 
            e.id as employeeId,
            CONCAT(e.f_name, ' ', e.l_name) as fullName,
            'Engineering' as department, 
            e.type as role,
            COALESCE(fp.net_salary, flp.final_amount) as netPay,
            p.status as status,
            CAST(p.created_at AS DATE) as paymentDate,
            COALESCE(fp.payslip_id, flp.payslip_id) as payslipId,
            CASE WHEN fp.payslip_id IS NOT NULL THEN 'FULLTIME' ELSE 'FREELANCE' END as contractType
        FROM payroll p
        LEFT JOIN fulltime_payslip fp ON p.id = fp.payroll_id
        LEFT JOIN freelance_payslip flp ON p.id = flp.payroll_id
        JOIN employee_account e ON COALESCE(fp.employee_id, flp.employee_id) = e.id
        WHERE p.month = :month AND p.year = :year
    """, nativeQuery = true)
    List<Object[]> findPayrollSummary(@Param("month") int month, @Param("year") int year);

    // --- STORED PROCEDURE ---
    @Modifying
    @Transactional
    @Query(value = "CALL sp_generate_fulltime_payslip(" +
            "CAST(:payrollId AS INTEGER), " +
            "CAST(:empId AS INTEGER), " +
            ":workDays, " +
            ":otValue, " +
            ":otherDeduction, " +
            "CAST(:manualBonus AS jsonb))", // Cast String sang JSONB của Postgres
            nativeQuery = true)
    void generateFulltimePayslip(
            @Param("payrollId") Long payrollId,
            @Param("empId") Long empId,
            @Param("workDays") Integer workDays,
            @Param("otValue") BigDecimal otValue,
            @Param("otherDeduction") BigDecimal otherDeduction,
            @Param("manualBonus") String manualBonus // Truyền JSON dạng String, vd: "{}"
    );

    // Trả về ID của kỳ lương nếu có
    @Query(value = "SELECT id FROM payroll WHERE month = :month AND year = :year LIMIT 1", nativeQuery = true)
    Long findPayrollIdByMonthYear(@Param("month") int month, @Param("year") int year);

    // 4. MỚI: Tạo bảng Payroll cha (nếu chưa có)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO payroll (month, year, period_start, period_end, status) " +
                   "VALUES (:month, :year, :start, :end, 'Unpaid')", nativeQuery = true)
    void createPayrollPeriod(@Param("month") int month, 
                             @Param("year") int year, 
                             @Param("start") java.time.LocalDate start, 
                             @Param("end") java.time.LocalDate end);
}