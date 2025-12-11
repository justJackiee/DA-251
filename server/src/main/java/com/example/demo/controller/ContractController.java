    package com.example.demo.controller;

    import com.example.demo.entity.FulltimeContract;
    import com.example.demo.repository.FulltimeContractRepository;

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

    }
