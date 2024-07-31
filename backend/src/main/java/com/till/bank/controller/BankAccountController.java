package com.till.bank.controller;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.BankAccountDtoForAccountsPage;
import com.till.bank.entity.BankAccount;
import com.till.bank.service.BankAccountService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/bankAccounts")
//@CrossOrigin(origins = "http://localhost:3000")
public class BankAccountController {

    private final BankAccountService bankAccountService;

    @Autowired
    public BankAccountController(BankAccountService bankAccountService) {
        this.bankAccountService = bankAccountService;
    }

    @GetMapping
    public ResponseEntity<List<BankAccount>> getAllBankAccounts() {
        List<BankAccount> bankAccounts = bankAccountService.getAllBankAccounts();
        return new ResponseEntity<>(bankAccounts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BankAccount> getBankAccountById(@PathVariable String id) {
        BankAccount bankAccount = bankAccountService.getBankAccountById(id);
        return new ResponseEntity<>(bankAccount, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BankAccountDto>> getBankAccountsByUserId(@PathVariable String userId) {
        List<BankAccount> bankAccounts = bankAccountService.getBankAccountsByUserId(userId);
        log.info("Found {} bank accounts for user {}", bankAccounts.size(), userId);
        log.info("account: "+bankAccounts.get(0).toString());

        List<BankAccountDto> bankAccountDtos = new ArrayList<>();
        for (BankAccount bankAccount : bankAccounts) {
            bankAccountDtos.add(convertBAToBADto(bankAccount));
            log.debug("Bank Account: {}", bankAccount);
        }

        return new ResponseEntity<>(bankAccountDtos, HttpStatus.OK);
    }

    private static BankAccountDto convertBAToBADto(BankAccount bankAccount) {
        BankAccountDto bankAccountDto = new BankAccountDto();
        bankAccountDto.setAccountNumber(bankAccount.getAccountNumber());
        bankAccountDto.setUser(bankAccount.getUser());
        bankAccountDto.setIBAN(bankAccount.getIBAN());
        bankAccountDto.setBankId(bankAccount.getBankId());
        bankAccountDto.setBalance(bankAccount.getBalance());
        bankAccountDto.setId(bankAccount.getId());
        bankAccountDto.setAccountType(bankAccount.getAccountType());
        bankAccountDto.setConfirmedByAdmin(bankAccount.isConfirmedByAdmin());
        return bankAccountDto;
    }

    @GetMapping("/user/{id}/accounts")
    public ResponseEntity<List<BankAccountDtoForAccountsPage>> getAccountsByUserId(@PathVariable String id) {
        List<BankAccountDtoForAccountsPage> accounts = bankAccountService.getBankAccountsByUserIdWithBankAccountDtoForAccountsPage(id);
        System.out.println(accounts);
        return accounts != null ? ResponseEntity.ok(accounts) : ResponseEntity.notFound().build();
    }

    @GetMapping("/accountNumbOrIBAN")
    public ResponseEntity<?> getBankAccountByAccNumbOrIBAN(@RequestParam String bankId, @RequestParam String accountNumber, @RequestParam String IBAN) {
        BankAccountDto bankAccountDto = new BankAccountDto(bankId, accountNumber, IBAN);
        ResponseEntity<?> bankAccountResponse = bankAccountService.getBankAccountByAccNumbOrIBAN(bankAccountDto);

        // Extract the BankAccount object from the ResponseEntity
        BankAccount bankAccount = (BankAccount) bankAccountResponse.getBody();
        // Check if the bankAccount is not null before proceeding
        if (bankAccount != null) {
            // Create and populate the BankAccountResponseDto object
            BankAccountDto responseDto = new BankAccountDto();
            responseDto.setBankId(bankAccount.getBankId());
            responseDto.setAccountNumber(bankAccount.getAccountNumber());
            responseDto.setIBAN(bankAccount.getIBAN());
            responseDto.setBalance(bankAccount.getBalance());
            responseDto.setUser(bankAccount.getUser()); // Assuming UserDto constructor accepts a User1 object
            responseDto.setId(bankAccount.getId()); // Assuming UserDto constructor accepts a User1 object
            // Return the ResponseEntity with the BankAccountResponseDto object as the body
            responseDto.setAccountType(bankAccount.getAccountType());
            responseDto.setConfirmedByAdmin(bankAccount.isConfirmedByAdmin());
            return ResponseEntity.ok(responseDto);
        } else {
            // Handle the case where bankAccount is null
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<BankAccount> createBankAccount(@RequestBody BankAccountDto bankAccountDto) {
        BankAccount createdBankAccount = bankAccountService.createBankAccount(bankAccountDto);
        return new ResponseEntity<>(createdBankAccount, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccount> updateBankAccount(@PathVariable String id, @RequestBody BankAccountDto bankAccountDto) {
        BankAccount updatedBankAccount = bankAccountService.updateBankAccount(id, bankAccountDto);
        return new ResponseEntity<>(updatedBankAccount, HttpStatus.OK);
    }

    @PutMapping("/activate/{id}")
    public ResponseEntity<BankAccount> activateBankAccount(@PathVariable String id) {
        BankAccount updatedBankAccount = bankAccountService.activateBankAccount(id);
        return new ResponseEntity<>(updatedBankAccount, HttpStatus.OK);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<BankAccount> cancelBankAccount(@PathVariable String id) {
        BankAccount updatedBankAccount = bankAccountService.cancelBankAccount(id);
        return new ResponseEntity<>(updatedBankAccount, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBankAccount(@PathVariable String id) {
        bankAccountService.deleteBankAccount(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
