package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.BankAccountDtoForAccountsPage;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
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
    @Override
    public BankAccount getBankAccountByUserId(Long userId) {
        return null;
    }

    @Autowired
    BankAccountRepository bankAccountRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<BankAccount> getAllBankAccounts() {

        return bankAccountRepository.findAll();
    }

    @Override
    public BankAccount getBankAccountById(Long id) {
        Optional<BankAccount> bankAccount=bankAccountRepository.findById(id);
        if(bankAccount != null){
            return bankAccount.get();
        }else {
            return null;
        }
    }

    @Override
    public BankAccount createBankAccount(BankAccountDto bankAccountDto) {
        return null;
    }

    @Override
    public BankAccount updateBankAccount(Long id, BankAccountDto bankAccountDto) {
        return null;
    }

    @Override
    public void deleteBankAccount(Long id) {

    }

    @Override
    public ResponseEntity<?> getBankAccountByAccNumbOrIBAN(BankAccountDto bankAccountDto) {
        try {
            BankAccount bankAccount;
            if(bankAccountDto.getIBAN() != ""){
                 bankAccount = bankAccountRepository.findByIBAN(bankAccountDto.getIBAN());

            }else{
                 bankAccount = bankAccountRepository.findByAccountNumber(bankAccountDto.getAccountNumber());
                if(!bankAccount.getBankId().equals(bankAccountDto.getBankId())){
                    return ResponseEntity.notFound().build();
                }
            }
            if (bankAccount != null) {
                // Fetch associated user data
                User1 user = bankAccount.getUser(); // Fetch user data based on the relationship defined in BankAccount entity

                return ResponseEntity.ok(bankAccount);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve bank account: " + e.getMessage());
        }
    }

    @Override
    public List<BankAccount> getBankAccountsByUserId(Long userId) {
        Optional<User1> user = userRepository.findById(userId);
        if (user.isPresent()) {
            return bankAccountRepository.findByUser_Id(userId);
        } else {
            return new ArrayList<>(); // Return an empty list if user is not found
        }
    }

    @Override
    public BankAccount activateBankAccount(Long id) {
        // Fetch the user by ID
        BankAccount bankAccount = bankAccountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bank account not found with id: " + id));

        // Set the confirmedByAdmin property to true
        bankAccount.setConfirmedByAdmin(true);

        // Save the updated user entity
        return bankAccountRepository.save(bankAccount);
    }

    @Override
    public List<BankAccountDtoForAccountsPage> getBankAccountsByUserIdWithBankAccountDtoForAccountsPage(Long userId) {
        List<BankAccount> accounts = bankAccountRepository.findByUserId(userId).orElseThrow();
        System.out.println("account service " + accounts);
        return accounts.stream()
                .map(account -> new BankAccountDtoForAccountsPage(
                        account.getAccountType(),
                        account.getIBAN(),
                        account.getUser(),
                        account.getBalance() // Assume accountType is available in BankAccount entity
                ))
                .collect(Collectors.toList());
    }

}
