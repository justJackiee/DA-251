package com.example.demo.repository;

import com.example.demo.entity.Employee; // Mượn tạm Entity để giữ chỗ generic
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TimesheetRepository extends JpaRepository<Employee, Long> {

    /**
     * Tính tổng số GIỜ làm việc thực tế trong tháng.
     * Logic: Tổng (Checkout - Checkin) quy đổi ra giờ.
     * COALESCE(..., 0) để tránh lỗi null nếu không có dữ liệu.
     */
    @Query(value = """
        SELECT COALESCE(SUM(EXTRACT(EPOCH FROM (checkout_time - checkin_time))/3600), 0)
        FROM timesheet
        WHERE employee_id = :empId
        AND EXTRACT(MONTH FROM date) = :month
        AND EXTRACT(YEAR FROM date) = :year
        AND checkout_time IS NOT NULL -- Chỉ tính những ngày đã checkout
    """, nativeQuery = true)
    Double calculateTotalWorkedHours(@Param("empId") Long empId, 
                                     @Param("month") int month, 
                                     @Param("year") int year);
}