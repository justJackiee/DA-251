package com.example.demo.repository;

import com.example.demo.entity.Timesheet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TimesheetRepository extends JpaRepository<Timesheet, String > {
    List<Timesheet> findByDateBetween(LocalDate start, LocalDate end);
}
