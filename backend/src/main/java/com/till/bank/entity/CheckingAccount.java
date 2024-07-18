package com.till.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@DiscriminatorValue("Girokonto")
@Data
public class CheckingAccount extends BankAccount {


    public CheckingAccount(Long id, String bankId, String accountNumber, String IBAN, User1 user, double balance) {
        super(id, bankId, accountNumber, IBAN, user, balance);
    }

    public CheckingAccount() {
    }

    public CheckingAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance) {
        super(bankId, accountNumber, IBAN, user, balance);
    }
}
