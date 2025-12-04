package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.EmployeeCreationRequest;
import com.example.demo.entity.FulltimeContract;
import com.example.demo.entity.FreelanceContract;
import com.example.demo.repository.FulltimeContractRepository;
import com.example.demo.repository.FreelanceContractRepository;

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
    @Autowired
    private FulltimeContractRepository fulltimeContractRepository;
    @Autowired
    private FreelanceContractRepository freelanceContractRepository;

    @GetMapping
    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Employee getById(@PathVariable Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<?> getEmployeeProfile(@PathVariable Long id) {
        // Fetch Employee
        Employee emp = employeeRepository.findById(id).orElse(null);
        if (emp == null) return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        
        // Map Basic Info
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
        
        // Fetch REAL Contracts (Dynamic)
        List<Map<String, Object>> contractsList = new ArrayList<>();

        if ("Fulltime".equalsIgnoreCase(emp.getType())) {
            List<FulltimeContract> fContracts = fulltimeContractRepository.findByEmployeeId(id);
            for (FulltimeContract fc : fContracts) {
                Map<String, Object> contractMap = new HashMap<>();
                contractMap.put("FullCon_ID", fc.getContractId());
                contractMap.put("StartDate", fc.getStartDate());
                contractMap.put("EndDate", fc.getEndDate());
                contractMap.put("BaseSalary", fc.getBaseSalary());
                contractMap.put("Type", fc.getType());
                contractMap.put("Status", "Active"); 
                contractsList.add(contractMap);
            }
        } else if ("Freelance".equalsIgnoreCase(emp.getType())) {
            List<FreelanceContract> flContracts = freelanceContractRepository.findByEmployeeId(id);
            for (FreelanceContract flc : flContracts) {
                Map<String, Object> contractMap = new HashMap<>();
                contractMap.put("FullCon_ID", flc.getContractId());
                contractMap.put("StartDate", flc.getStartDate());
                contractMap.put("EndDate", flc.getEndDate());
                contractMap.put("BaseSalary", flc.getValue());
                contractMap.put("Type", "Project");
                contractMap.put("Status", "Active");
                contractsList.add(contractMap);
            }
        }
        
        response.put("contracts", contractsList);
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

            System.out.println("Received updates: " + updates); 

            // Update fields if they exist in the request
            if (updates.containsKey("Name")) {
                String fullName = updates.get("Name").trim();
                String[] names = fullName.split("\\s+"); // Split by whitespace

                if (names.length > 0) {
                    emp.setFName(names[0]); // First word is First Name
                }
                
                if (names.length == 1) {
                    emp.setMName(null);
                    emp.setLName(""); 
                } else if (names.length == 2) {
                    emp.setMName(null); 
                    emp.setLName(names[1]);
                } else {
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
            
            System.out.println("About to save employee: " + emp); 

            employeeRepository.save(emp);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Profile updated successfully"));
        } catch (Exception e) {
            e.printStackTrace(); 
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody EmployeeCreationRequest request) {
        try {
            Employee emp = new Employee();
            emp.setFName(request.getFName());
            emp.setLName(request.getLName());
            emp.setSex(request.getSex());
            emp.setPhone(request.getPhone());
            emp.setEmail(request.getEmail());
            emp.setAddress(request.getAddress());
            emp.setDob(request.getDob());
            emp.setType(request.getType()); 
            emp.setStatus("Active");
            emp.setUsername(request.getUsername());
            emp.setPassword(request.getPassword()); 
            emp.setBankAccountNumber(request.getBankAccountNumber());

            Employee savedEmp = employeeRepository.save(emp);

            if ("Fulltime".equalsIgnoreCase(request.getType())) {
                FulltimeContract contract = new FulltimeContract();
                contract.setEmployeeId(savedEmp.getId());
                contract.setStartDate(request.getContract().getStartDate());
                contract.setEndDate(request.getContract().getEndDate());
                contract.setBaseSalary(request.getContract().getBaseSalary());
                contract.setOtRate(request.getContract().getOtRate());
                contract.setAnnualLeaveDays(request.getContract().getAnnualLeaveDays());
                contract.setType(request.getContract().getContractType()); 
                fulltimeContractRepository.save(contract);

            } else if ("Freelance".equalsIgnoreCase(request.getType())) {
                FreelanceContract contract = new FreelanceContract();
                contract.setEmployeeId(savedEmp.getId());
                contract.setStartDate(request.getContract().getStartDate());
                contract.setEndDate(request.getContract().getEndDate());
                contract.setValue(request.getContract().getContractValue());
                contract.setCommittedDeadline(request.getContract().getCommittedDeadline());
                
                freelanceContractRepository.save(contract);
            }
            return ResponseEntity.ok(Map.of("success", true, "message", "Employee and Contract created!", "id", savedEmp.getId()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}