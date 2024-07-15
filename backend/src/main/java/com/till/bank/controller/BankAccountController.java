package com.till.bank.controller;


import com.till.bank.dto.BankAccountDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.service.BankAccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/bankAccount")
@CrossOrigin(origins = "http://localhost:3000")
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
    public ResponseEntity<BankAccount> getBankAccountById(@PathVariable Long id) {
        BankAccount bankAccount = bankAccountService.getBankAccountById(id);
        return new ResponseEntity<>(bankAccount, HttpStatus.OK);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<BankAccountDto> getBankAccountByUserId(@PathVariable Long userId) {
        BankAccount bankAccount = bankAccountService.getBankAccountByUserId(userId);
        BankAccountDto bankAccountDto=new BankAccountDto();
        bankAccountDto.setAccountNumber(bankAccount.getAccountNumber());
        bankAccountDto.setUser(bankAccount.getUser());
        bankAccountDto.setIBAN(bankAccount.getIBAN());
        bankAccountDto.setBankId(bankAccount.getBankId());
        bankAccountDto.setBalance(bankAccount.getBalance());
        bankAccountDto.setId(bankAccount.getId());

        return new ResponseEntity<>(bankAccountDto, HttpStatus.OK);
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
            return ResponseEntity.ok(responseDto);
        } else {
            // Handle the case where bankAccount is null
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<BankAccount> createBankAccount(@RequestBody BankAccountDto bankAccountDto) {
        BankAccount createdBankAccount= bankAccountService.createBankAccount(bankAccountDto);
        return new ResponseEntity<>(createdBankAccount, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BankAccount> updateBankAccount(@PathVariable Long id, @RequestBody BankAccountDto bankAccountDto) {
        BankAccount updatedBankAccount = bankAccountService.updateBankAccount(id, bankAccountDto);
        return new ResponseEntity<>(updatedBankAccount, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBankAccount(@PathVariable Long id) {
        bankAccountService.deleteBankAccount(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
