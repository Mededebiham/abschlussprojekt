package com.till.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
public class SavingsAccount extends BankAccount{
    private BigDecimal interestRate;


    public SavingsAccount() {
        super();
    }

    public SavingsAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance, BigDecimal interestRate) {
        super(bankId, accountNumber, IBAN, user, balance);
        this.interestRate = interestRate;
    }



}
