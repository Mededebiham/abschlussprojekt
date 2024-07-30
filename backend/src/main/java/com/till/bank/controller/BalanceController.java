package com.till.bank.controller;

import com.till.bank.entity.Balance;
import com.till.bank.repository.BalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/balances")
public class BalanceController {

    @Autowired
    private BalanceRepository balanceRepository;



    @GetMapping
    public List<Balance> getBalancesByIban(@RequestParam String iban) {
        return balanceRepository.findByIbanOrderByDateAsc(iban);
    }

    // ID ile tek bir Balance kaydını alır
    @GetMapping("/{id}")
    public ResponseEntity<Balance> getBalanceById(@PathVariable Long id) {
        Optional<Balance> balance = balanceRepository.findById(id);
        if (balance.isPresent()) {
            return ResponseEntity.ok(balance.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public Balance createBalance(@RequestBody Balance balance) {
        return balanceRepository.save(balance);
    }



}
