package com.example.demo.controller;

import com.example.demo.entity.FreelanceContract;
import com.example.demo.entity.Employee;
import com.example.demo.entity.subtable.FreelanceContractBonus;
import com.example.demo.entity.subtable.FreelanceContractPenalty;
import com.example.demo.repository.FreelanceContractRepository;
import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.FreelanceContractBonusRepository;
import com.example.demo.repository.FreelanceContractPenaltyRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/freelance-contracts")
@CrossOrigin(origins = "*")
public class FreelanceContractController {

    @Autowired
    private FreelanceContractRepository freelanceContractRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private FreelanceContractBonusRepository bonusRepository;

    @Autowired
    private FreelanceContractPenaltyRepository penaltyRepository;

    // GET ALL
    @GetMapping
    public List<FreelanceContract> getAllContracts() {
        return freelanceContractRepository.findAll();
    }

    // GET BY CONTRACT ID (with employee info, bonuses, penalties)
    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Long id) {
        FreelanceContract contract = freelanceContractRepository.findById(id).orElse(null);
        if (contract == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Contract not found"));
        }

        // Build response with additional info
        Map<String, Object> response = new HashMap<>();
        response.put("contractId", contract.getContractId());
        response.put("employeeId", contract.getEmployeeId());
        response.put("startDate", contract.getStartDate());
        response.put("endDate", contract.getEndDate());
        response.put("value", contract.getValue());
        response.put("committedDeadline", contract.getCommittedDeadline());
        response.put("documentPath", contract.getDocumentPath());

        // Build document URL if path exists
        if (contract.getDocumentPath() != null && !contract.getDocumentPath().isEmpty()) {
            response.put("document_url", "/api/employees/uploads/contracts/" +
                    contract.getDocumentPath().substring(contract.getDocumentPath().lastIndexOf("/") + 1));
        }

        // Get employee info
        Employee emp = employeeRepository.findById(contract.getEmployeeId()).orElse(null);
        if (emp != null) {
            String fullName = (emp.getFName() != null ? emp.getFName() : "") + " " +
                    (emp.getMName() != null ? emp.getMName() + " " : "") +
                    (emp.getLName() != null ? emp.getLName() : "");
            response.put("employee_name", fullName.trim());
        }

        // Get bonuses and penalties
        List<FreelanceContractBonus> bonuses = bonusRepository.findByContractIdOrderByStt(id);
        List<FreelanceContractPenalty> penalties = penaltyRepository.findByContractIdOrderByStt(id);

        response.put("bonuses", bonuses);
        response.put("deductions", penalties); // Map penalties to deductions for frontend compatibility

        return ResponseEntity.ok(response);
    }

    // GET BONUSES BY CONTRACT ID
    @GetMapping("/{id}/bonuses")
    public ResponseEntity<?> getBonusesByContractId(@PathVariable Long id) {
        List<FreelanceContractBonus> bonuses = bonusRepository.findByContractIdOrderByStt(id);
        return ResponseEntity.ok(bonuses);
    }

    // GET PENALTIES BY CONTRACT ID
    @GetMapping("/{id}/penalties")
    public ResponseEntity<?> getPenaltiesByContractId(@PathVariable Long id) {
        List<FreelanceContractPenalty> penalties = penaltyRepository.findByContractIdOrderByStt(id);
        return ResponseEntity.ok(penalties);
    }
}
