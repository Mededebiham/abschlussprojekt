package com.till.bank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bank_accounts")
public class BankAccount {

    @Id
    private String id;

    private String bankId;
    private String accountNumber;
    private String IBAN;

    @DBRef
    @JsonIgnore
    private User1 user;

    private double balance;
    private boolean confirmedByAdmin = false;

    @Field("account_type")
    private String accountType;

    public BankAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance) {
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
        this.user = user;
        this.balance = balance;
    }

    public BankAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance, String accountType) {
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
        this.user = user;
        this.balance = balance;
        this.accountType = accountType;
    }

    @Override
    public String toString() {
        return "BankAccount{" +
                "bankId='" + bankId + '\'' +
                ", accountNumber='" + accountNumber + '\'' +
                ", IBAN='" + IBAN + '\'' +
                ", user=" + (user != null ? user.getId() : "null") +
                ", balance=" + balance +
                ", id=" + id +
                ", accountType='" + accountType + '\'' +
                ", confirmedByAdmin=" + confirmedByAdmin +
                '}';
    }
}
