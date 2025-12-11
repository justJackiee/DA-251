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
import com.example.demo.entity.PayslipHistoryDTO;
import com.example.demo.repository.FulltimePayslipRepository;
import com.example.demo.repository.FreelancePayslipRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;

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

    @Autowired
    private FulltimePayslipRepository fulltimeRepo;

    @Autowired
    private FreelancePayslipRepository freelanceRepo;

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
        
        List<PayslipHistoryDTO> latestPayslip = new ArrayList<>();
        
        // Kiểm tra xem nhân viên là Fulltime hay Freelance để gọi đúng Repo
        if ("Fulltime".equalsIgnoreCase(emp.getType())) {
            List<PayslipHistoryDTO> ftLatest = fulltimeRepo.findLatest(id);
            if (ftLatest != null && !ftLatest.isEmpty()) {
                latestPayslip.addAll(ftLatest);
            }
        } else { // Freelance
            List<PayslipHistoryDTO> flLatest = freelanceRepo.findLatest(id);
            if (flLatest != null && !flLatest.isEmpty()) {
                latestPayslip.addAll(flLatest);
            }
        }
        response.put("payslips", latestPayslip);

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

    @PostMapping("/{id}/contracts")
    public ResponseEntity<?> addContractToEmployee(@PathVariable Long id, @RequestBody Map<String, Object> contract) {
        try {
            Employee emp = employeeRepository.findById(id).orElse(null);
            if (emp == null) return ResponseEntity.notFound().build();

            if ("Fulltime".equalsIgnoreCase(emp.getType())) {
                FulltimeContract fc = new FulltimeContract();
                fc.setEmployeeId(id);
                if (contract.get("startDate") != null) fc.setStartDate(LocalDate.parse((String) contract.get("startDate")));
                if (contract.get("endDate") != null && contract.get("endDate") instanceof String && !((String)contract.get("endDate")).isBlank()) fc.setEndDate(LocalDate.parse((String) contract.get("endDate")));
                if (contract.get("baseSalary") != null) fc.setBaseSalary(Double.valueOf(contract.get("baseSalary").toString()));
                if (contract.get("otRate") != null) fc.setOtRate(Double.valueOf(contract.get("otRate").toString()));
                if (contract.get("annualLeaveDays") != null) fc.setAnnualLeaveDays(Integer.valueOf(contract.get("annualLeaveDays").toString()));
                if (contract.get("contractType") != null) fc.setType((String) contract.get("contractType"));
                fulltimeContractRepository.save(fc);

            } else {
                FreelanceContract fl = new FreelanceContract();
                fl.setEmployeeId(id);
                if (contract.get("startDate") != null) fl.setStartDate(LocalDate.parse((String) contract.get("startDate")));
                if (contract.get("endDate") != null && contract.get("endDate") instanceof String && !((String)contract.get("endDate")).isBlank()) fl.setEndDate(LocalDate.parse((String) contract.get("endDate")));
                if (contract.get("contractValue") != null) fl.setValue(Double.valueOf(contract.get("contractValue").toString()));
                if (contract.get("committedDeadline") != null && contract.get("committedDeadline") instanceof String && !((String)contract.get("committedDeadline")).isBlank()) fl.setCommittedDeadline(LocalDate.parse((String) contract.get("committedDeadline")));
                freelanceContractRepository.save(fl);
            }

            return ResponseEntity.ok(Map.of("success", true, "message", "Contract added."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    // --- API: LẤY LỊCH SỬ LƯƠNG ---
    @GetMapping("/{id}/payslip-history")
    public ResponseEntity<List<PayslipHistoryDTO>> getPayslipHistory(@PathVariable Long id) {
        
        List<PayslipHistoryDTO> history = new ArrayList<>();

        // 1. Lấy dữ liệu từ bảng Fulltime
        List<PayslipHistoryDTO> ftList = fulltimeRepo.findHistory(id);
        if (ftList != null) history.addAll(ftList);

        // 2. Lấy dữ liệu từ bảng Freelance
        List<PayslipHistoryDTO> flList = freelanceRepo.findHistory(id);
        if (flList != null) history.addAll(flList);

        // 3. Sắp xếp giảm dần theo thời gian (Năm -> Tháng)
        history.sort((a, b) -> {
            int yearCompare = b.getYear().compareTo(a.getYear());
            if (yearCompare != 0) return yearCompare;
            return b.getMonth().compareTo(a.getMonth());
        });

        return ResponseEntity.ok(history);
    }
}