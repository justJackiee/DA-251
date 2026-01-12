    package com.example.demo.controller;

    import com.example.demo.entity.FulltimeContract;
    import com.example.demo.entity.subtable.FulltimeContractAllowance;
    import com.example.demo.entity.subtable.FulltimeContractBonus;
    import com.example.demo.entity.subtable.FulltimeContractDeduction;
    import com.example.demo.repository.FulltimeContractRepository;
    import com.example.demo.repository.FulltimeContractAllowanceRepository;
    import com.example.demo.repository.FulltimeContractBonusRepository;
    import com.example.demo.repository.FulltimeContractDeductionRepository;

    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.*;

    @RestController
    @RequestMapping("/api/fulltime-contracts")
    @CrossOrigin(origins = "*")
    public class ContractController {

        @Autowired
        private FulltimeContractRepository fulltimeContractRepository;

        @Autowired
        private FulltimeContractAllowanceRepository allowanceRepository;

        @Autowired
        private FulltimeContractBonusRepository bonusRepository;

        @Autowired
        private FulltimeContractDeductionRepository deductionRepository;

        // -----------------------------
        // GET ALL
        // -----------------------------
        @GetMapping
        public List<FulltimeContract> getAllContracts() {
            return fulltimeContractRepository.findAll();
        }

        // -----------------------------
        // GET BY CONTRACT ID
        // -----------------------------
        @GetMapping("/{id}")
        public ResponseEntity<?> getContractById(@PathVariable Long id) {
            FulltimeContract contract = fulltimeContractRepository.findById(id).orElse(null);
            if (contract == null) {
                return ResponseEntity.status(404).body(Map.of("message", "Contract not found"));
            }
            return ResponseEntity.ok(contract);
        }

        // -----------------------------
        // GET ALLOWANCES BY CONTRACT ID
        // -----------------------------
        @GetMapping("/{id}/allowances")
        public ResponseEntity<?> getAllowancesByContractId(@PathVariable Long id) {
            List<FulltimeContractAllowance> allowances = allowanceRepository.findByContractIdOrderByStt(id);
            return ResponseEntity.ok(allowances);
        }

        // -----------------------------
        // GET BONUSES BY CONTRACT ID
        // -----------------------------
        @GetMapping("/{id}/bonuses")
        public ResponseEntity<?> getBonusesByContractId(@PathVariable Long id) {
            List<FulltimeContractBonus> bonuses = bonusRepository.findByContractIdOrderByStt(id);
            return ResponseEntity.ok(bonuses);
        }

        // -----------------------------
        // GET DEDUCTIONS BY CONTRACT ID
        // -----------------------------
        @GetMapping("/{id}/deductions")
        public ResponseEntity<?> getDeductionsByContractId(@PathVariable Long id) {
            List<FulltimeContractDeduction> deductions = deductionRepository.findByContractIdOrderByStt(id);
            return ResponseEntity.ok(deductions);
        }

    }
