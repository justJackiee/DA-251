package com.example.demo.repository;
import com.example.demo.entity.FulltimeContract;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FulltimeContractRepository extends JpaRepository<FulltimeContract, Long> {
    List<FulltimeContract> findByEmployeeId(Long employeeId);
}