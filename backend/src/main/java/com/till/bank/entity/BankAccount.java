package com.till.bank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String bankId;
    private String accountNumber;
    private String IBAN;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private User1 user;
    private double balance;

    public BankAccount(String bankId, String accountNumber, String IBAN, User1 user, double balance) {
        this.bankId = bankId;
        this.accountNumber = accountNumber;
        this.IBAN = IBAN;
        this.user = user;
        this.balance = balance;
    }
    @Override
    public String toString() {
        return "BankAccount{" +
                "bankId='" + bankId + '\'' +
                ", accountNumber='" + accountNumber + '\'' +
                ", IBAN='" + IBAN + '\'' +
                ", user=" + (user != null ? user.getId() : "null") + // Customized user representation
                ", balance=" + balance +
                ", id=" + id +
                '}';
    }
}
