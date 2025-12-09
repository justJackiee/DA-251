package com.example.demo.repository;

import com.example.demo.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Integer> { 
    // Lưu ý: Đổi thành <Payroll, Integer> vì đây là repository quản lý bảng Payroll (bảng cha)

    // =========================================================================
    // 1. DASHBOARD & REPORTING (Lấy dữ liệu tổng hợp cho bảng lương)
    // =========================================================================
    @Query(value = """
        SELECT DISTINCT ON (e.id)
            e.id as employeeId,
            CONCAT(e.f_name, ' ', e.l_name) as fullName,
            'Engineering' as department, 
            e.type as role,
            ROUND(COALESCE(fp.gross_salary, flp.final_amount), -3) as grossPay,
            ROUND(COALESCE(fp.net_salary, flp.final_amount), -3) as netPay,
            p.status as status,
            CAST(p.created_at AS DATE) as paymentDate,
            COALESCE(fp.payslip_id, flp.payslip_id) as payslipId,
            CASE WHEN fp.payslip_id IS NOT NULL THEN 'FULLTIME' ELSE 'FREELANCE' END as contractType,
            p.id as payrollId
        FROM payroll p
        LEFT JOIN fulltime_payslip fp ON p.id = fp.payroll_id
        LEFT JOIN freelance_payslip flp ON p.id = flp.payroll_id
        JOIN employee_account e ON COALESCE(fp.employee_id, flp.employee_id) = e.id
        WHERE p.month = :month AND p.year = :year
        ORDER BY e.id, p.created_at DESC -- Ưu tiên lấy bản ghi mới nhất nếu có trùng
    """, nativeQuery = true)
    List<Object[]> findPayrollSummary(@Param("month") int month, @Param("year") int year);

    // =========================================================================
    // 2. CALCULATION LOGIC (Gọi Stored Procedure)
    // =========================================================================
    @Modifying
    @Transactional
    @Query(value = "CALL sp_generate_fulltime_payslip(" +
            "CAST(:payrollId AS INTEGER), " +
            "CAST(:empId AS INTEGER), " +
            ":workDays, " +
            ":otHours, " +             
            "CAST(:manualBonus AS jsonb))", 
            nativeQuery = true)
    void generateFulltimePayslip(
            @Param("payrollId") Integer payrollId, // Dùng Integer khớp với SERIAL trong DB
            @Param("empId") Integer empId,
            @Param("workDays") Integer workDays,
            @Param("otHours") BigDecimal otHours, // Dùng BigDecimal để đảm bảo độ chính xác
            @Param("manualBonus") String manualBonus
    );

    // =========================================================================
    // 3. PAYROLL PERIOD MANAGEMENT (Quản lý kỳ lương)
    // =========================================================================
    
    // Tìm ID kỳ lương theo tháng/năm (Để check xem đã tạo chưa)
    @Query(value = "SELECT id FROM payroll WHERE month = :month AND year = :year LIMIT 1", nativeQuery = true)
    Optional<Integer> findPayrollIdByMonthYear(@Param("month") int month, @Param("year") int year);

    // Tạo kỳ lương mới (Nếu không muốn dùng save() của JPA)
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO payroll (month, year, period_start, period_end, status) " +
                   "VALUES (:month, :year, :start, :end, 'Unpaid')", nativeQuery = true)
    void createPayrollPeriod(@Param("month") int month, 
                             @Param("year") int year, 
                             @Param("start") LocalDate start, 
                             @Param("end") LocalDate end);

    // Cập nhật trạng thái (Ví dụ: Chốt lương -> Paid)
    @Modifying
    @Transactional
    @Query("UPDATE Payroll p SET p.status = :status WHERE p.id = :id")
    void updateStatus(@Param("id") Integer id, @Param("status") String status);
}