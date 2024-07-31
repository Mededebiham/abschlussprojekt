package com.till.bank.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Document(collection = "savings_accounts")
public class SavingsAccount extends BankAccount {


    private BigDecimal interestRate;

    // Default constructor
    public SavingsAccount() {
        super();
    }

    public SavingsAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance, BigDecimal interestRate) {
        super(bankId, accountNumber, IBAN, user, balance);
        this.interestRate = interestRate;
    }
}
