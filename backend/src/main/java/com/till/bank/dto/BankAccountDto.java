package com.till.bank.dto;

import com.till.bank.entity.User1;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountDto {
    private Long id;
    private String bankId;
    private String accountNumber;
    private String IBAN;
    private String accountType;
    private boolean confirmedByAdmin = false;
    private User1 user;
    private double balance;



    public BankAccountDto(String bankId, String accountNumber, String IBAN) {
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
    }
    public BankAccountDto(User1 user,String bankId, String accountNumber, String IBAN) {
        this.user=user;
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
    }

    public BankAccountDto(Long id, String bankId, String accountNumber, String IBAN, String accountType, boolean confirmedByAdmin, User1 user, double balance) {
        this.id = id;
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
        this.accountType = accountType;
        this.confirmedByAdmin = confirmedByAdmin;
        this.user = user;
        this.balance = balance;
    }

    public BankAccountDto(long l) {
        this.id=id;
    }
}
