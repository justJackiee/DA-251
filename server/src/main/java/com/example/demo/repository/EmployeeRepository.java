package com.example.demo.repository;

import com.example.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // MỚI: Lấy danh sách nhân viên Fulltime đang Active để tính lương
    @Query(value = "SELECT * FROM employee_account WHERE type = 'Fulltime' AND status = 'Active'", nativeQuery = true)
    List<Employee> findAllActiveFulltime();
}