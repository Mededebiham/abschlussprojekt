package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.BankAccountDtoForAccountsPage;
import com.till.bank.entity.BankAccount;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface BankAccountService {
    List<BankAccount> getAllBankAccounts();

    BankAccount getBankAccountById(String id);

    BankAccount createBankAccount(BankAccountDto bankAccountDto);

    BankAccount updateBankAccount(String id, BankAccountDto bankAccountDto);

    void deleteBankAccount(String id);

    ResponseEntity<?> getBankAccountByAccNumbOrIBAN(BankAccountDto bankAccountDto);

    BankAccount getBankAccountByUserId(String userId);

    List<BankAccountDtoForAccountsPage> getBankAccountsByUserIdWithBankAccountDtoForAccountsPage(String userId);

    List<BankAccount> getBankAccountsByUserId(String userId);

    BankAccount activateBankAccount(String id);

    BankAccount cancelBankAccount(String id);
}
