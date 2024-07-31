package com.till.bank.service;

import com.till.bank.entity.Balance;
import com.till.bank.repository.BalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Service
public class BalanceService {

    private final BalanceRepository balanceRepository;

    @Autowired
    public BalanceService(BalanceRepository balanceRepository) {
        this.balanceRepository = balanceRepository;
    }

    public List<Balance> getBalancesByIban(String iban) {
        return balanceRepository.findByIbanOrderByDateAsc(iban);
    }


    public Balance createBalance(Balance balance) {
        return balanceRepository.save(balance);
    }
}
