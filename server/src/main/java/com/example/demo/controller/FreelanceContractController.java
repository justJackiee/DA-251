package com.example.demo.controller;

import com.example.demo.entity.FreelanceContract;
import com.example.demo.repository.FreelanceContractRepository;

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

    // GET ALL
    @GetMapping
    public List<FreelanceContract> getAllContracts() {
        return freelanceContractRepository.findAll();
    }

    // GET BY CONTRACT ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getContractById(@PathVariable Long id) {
        FreelanceContract contract = freelanceContractRepository.findById(id).orElse(null);
        if (contract == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Contract not found"));
        }
        return ResponseEntity.ok(contract);
    }

}
