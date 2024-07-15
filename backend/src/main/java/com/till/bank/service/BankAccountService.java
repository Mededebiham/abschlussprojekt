package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BankAccountService {
    List<BankAccount> getAllBankAccounts();

    BankAccount getBankAccountById(Long id);

    BankAccount createBankAccount(BankAccountDto bankAccountDto);

    BankAccount updateBankAccount(Long id, BankAccountDto bankAccountDto);

    void deleteBankAccount(Long id);

    ResponseEntity<?> getBankAccountByAccNumbOrIBAN(BankAccountDto bankAccountDto);

    BankAccount getBankAccountByUserId(Long userId);
}
