package com.till.bank.controller;

import com.till.bank.entity.Balance;

import com.till.bank.service.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/balances")
public class BalanceController {

    @Autowired
    private BalanceService balanceService;



    @GetMapping
    public List<Balance> getBalancesByIban(@RequestParam String iban) {
        return balanceService.getBalancesByIban(iban);
    }




    @PostMapping
    public Balance createBalance(@RequestBody Balance balance) {
        return balanceService.createBalance(balance);
    }



}
