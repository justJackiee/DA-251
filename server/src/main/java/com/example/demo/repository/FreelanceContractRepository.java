package com.example.demo.repository;
import com.example.demo.entity.FreelanceContract;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FreelanceContractRepository extends JpaRepository<FreelanceContract, Long> {
    List<FreelanceContract> findByEmployeeId(Long employeeId);
}