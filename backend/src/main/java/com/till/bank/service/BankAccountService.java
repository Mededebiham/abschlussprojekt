package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.BankAccountDtoForAccountsPage;
import com.till.bank.entity.BankAccount;
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

    List<BankAccountDtoForAccountsPage> getBankAccountsByUserIdWithBankAccountDtoForAccountsPage(Long userId);
    List<BankAccount> getBankAccountsByUserId(Long userId);

    BankAccount activateBankAccount(Long id);

    BankAccount cancelBankAccount(Long id);
}
