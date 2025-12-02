package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    // Sửa String id thành Long id
    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getEmployeeProfile(@PathVariable Long id) {
        // 1. Lấy thông tin cơ bản
        Employee emp = employeeRepository.findById(id).orElse(null);
        if (emp == null) {
            return ResponseEntity.notFound().build();
        }

        // 2. Lấy danh sách hợp đồng (Giả sử bạn đã có Repository cho Contract)
        // Nếu chưa có, bạn cần tạo ContractRepository và Entity tương ứng
        // Tạm thời mình mock dữ liệu trả về để Frontend chạy được đã nhé:
        
        Map<String, Object> response = new HashMap<>();
        
        // Thông tin cơ bản
        Map<String, Object> info = new HashMap<>();
        info.put("ID", emp.getId());
        info.put("Name", emp.getFName() + " " + emp.getLName());
        info.put("Position", emp.getType());
        info.put("Email", emp.getEmail());
        info.put("Phone", emp.getPhone());
        info.put("Address", emp.getAddress());
        info.put("City", "HCMC"); // Tạm hardcode hoặc tách từ address
        info.put("Department", "Engineering"); // Tạm hardcode
        info.put("StartDate", "2025-01-01"); 

        response.put("info", info);
        
        // Mock Contract Data (Sau này bạn query từ DB thật)
        List<Map<String, Object>> contracts = new ArrayList<>();
        Map<String, Object> contract1 = new HashMap<>();
        contract1.put("FullCon_ID", "FC001");
        contract1.put("StartDate", "2025-01-01");
        contract1.put("EndDate", null);
        contract1.put("BaseSalary", 20000000);
        contract1.put("Type", "Indefinite");
        contract1.put("Status", "Active");
        contracts.add(contract1);
        
        response.put("contracts", contracts);
        
        // Mock Payslip Data
        response.put("payslips", new ArrayList<>());

        return ResponseEntity.ok(response);
    }
}