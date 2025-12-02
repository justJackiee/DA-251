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
        
        Map<String, Object> response = new HashMap<>();
        
        // Thông tin cơ bản
        Map<String, Object> info = new HashMap<>();
        info.put("ID", emp.getId());
        info.put("Name", emp.getFName() + " " + emp.getLName());
        info.put("Position", emp.getType());
        info.put("Email", emp.getEmail());
        info.put("Phone", emp.getPhone());
        info.put("Address", emp.getAddress());
        info.put("City", "HCMC"); 
        info.put("Department", "Engineering"); 
        info.put("StartDate", "2025-01-01"); 

        response.put("info", info);
        
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
    @PutMapping("/{id}")
    public ResponseEntity<?> updateEmployee(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        try {
            Employee emp = employeeRepository.findById(id).orElse(null);
            if (emp == null) {
                return ResponseEntity.notFound().build();
            }

            System.out.println("Received updates: " + updates); // Debug log

            // Update fields if they exist in the request
            if (updates.containsKey("Name")) {
                String fullName = updates.get("Name").trim();
                String[] names = fullName.split("\\s+"); // Split by whitespace

                if (names.length > 0) {
                    emp.setFName(names[0]); // First word is First Name
                }
                
                if (names.length == 1) {
                    // Only one name provided
                    emp.setMName(null);
                    emp.setLName(""); // Or keep null depending on DB constraints
                } else if (names.length == 2) {
                    // Two names provided (First + Last)
                    emp.setMName(null); // CLEAR the middle name
                    emp.setLName(names[1]);
                } else {
                    // Three or more names (First + Middle + Last)
                    // Everything between first and last becomes Middle Name
                    String middleName = "";
                    for (int i = 1; i < names.length - 1; i++) {
                        middleName += names[i] + " ";
                    }
                    emp.setMName(middleName.trim());
                    emp.setLName(names[names.length - 1]);
                }
            }
            if (updates.containsKey("Phone")) {
                emp.setPhone(updates.get("Phone"));
            }
            if (updates.containsKey("Email")) {
                emp.setEmail(updates.get("Email"));
            }
            if (updates.containsKey("Address")) {
                emp.setAddress(updates.get("Address"));
            }
            if (updates.containsKey("Position")) {
                emp.setType(updates.get("Position"));
            }
            
            System.out.println("About to save employee: " + emp); // Debug log

            employeeRepository.save(emp);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully"));
        } catch (Exception e) {
            e.printStackTrace(); // This will show the exact error in your console
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}