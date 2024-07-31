package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.BankAccountDtoForAccountsPage;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.User1;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class BankAccountServiceImpl implements BankAccountService {

    @Autowired
    BankAccountRepository bankAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<BankAccount> getAllBankAccounts() {
        return bankAccountRepository.findAll();
    }

    @Override
    public BankAccount getBankAccountById(String id) {
        return bankAccountRepository.findById(id).orElse(null);
    }

    @Override
    public BankAccount createBankAccount(BankAccountDto bankAccountDto) {
        BankAccount bankAccount = new BankAccount(
                bankAccountDto.getBankId(),
                bankAccountDto.getAccountNumber(),
                bankAccountDto.getIBAN(),
                bankAccountDto.getUser(),
                bankAccountDto.getBalance(),
                bankAccountDto.getAccountType()
        );
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public BankAccount updateBankAccount(String id, BankAccountDto bankAccountDto) {
        BankAccount existingBankAccount = getBankAccountById(id);
        if (existingBankAccount != null) {
            existingBankAccount.setBankId(bankAccountDto.getBankId());
            existingBankAccount.setAccountNumber(bankAccountDto.getAccountNumber());
            existingBankAccount.setIBAN(bankAccountDto.getIBAN());
            existingBankAccount.setUser(bankAccountDto.getUser());
            existingBankAccount.setBalance(bankAccountDto.getBalance());
            existingBankAccount.setAccountType(bankAccountDto.getAccountType());
            existingBankAccount.setConfirmedByAdmin(bankAccountDto.isConfirmedByAdmin());
            return bankAccountRepository.save(existingBankAccount);
        } else {
            return null;
        }
    }

    @Override
    public void deleteBankAccount(String id) {
        bankAccountRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<?> getBankAccountByAccNumbOrIBAN(BankAccountDto bankAccountDto) {
        try {
            BankAccount bankAccount;
            if (!bankAccountDto.getIBAN().isEmpty()) {
                bankAccount = bankAccountRepository.findByIBAN(bankAccountDto.getIBAN());
            } else {
                bankAccount = bankAccountRepository.findByAccountNumber(bankAccountDto.getAccountNumber());
                if (!bankAccount.getBankId().equals(bankAccountDto.getBankId())) {
                    return ResponseEntity.notFound().build();
                }
            }
            if (bankAccount != null) {
                return ResponseEntity.ok(bankAccount);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve bank account: " + e.getMessage());
        }
    }

    @Override
    public List<BankAccount> getBankAccountsByUserId(String userId) {
        Optional<User1> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return bankAccountRepository.findByUser_Id(userId);
        } else {
            return new ArrayList<>(); // Return an empty list if user is not found
        }
    }

    @Override
    public BankAccount activateBankAccount(String id) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        bankAccount.setConfirmedByAdmin(true);
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public BankAccount cancelBankAccount(String id) {
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));
        bankAccount.setConfirmedByAdmin(false);
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public List<BankAccountDtoForAccountsPage> getBankAccountsByUserIdWithBankAccountDtoForAccountsPage(String userId) {
        List<BankAccount> accounts = bankAccountRepository.findByUserId(userId).orElseThrow();
        return accounts.stream()
                .map(account -> new BankAccountDtoForAccountsPage(
                        account.getAccountType(),
                        account.getIBAN(),
                        account.getUser(),
                        account.getBalance()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public BankAccount getBankAccountByUserId(String userId) {
        return bankAccountRepository.findByUserId(userId).orElseThrow().stream().findFirst().orElse(null);
    }
}
