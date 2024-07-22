package com.till.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@DiscriminatorValue("Girokonto")
public class CheckingAccount extends BankAccount {


    public CheckingAccount() {
        super();
    }

    public CheckingAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance) {
        super(bankId, accountNumber, IBAN, user, balance);
    }
}
