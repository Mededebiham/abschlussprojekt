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
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "account_type", discriminatorType = DiscriminatorType.STRING)
public abstract class BankAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bankId;

    private String accountNumber;

    private String IBAN;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User1 user;

    private double balance;

    private boolean confirmedByAdmin = false;

    @Transient
    private String accountType;

    @PostLoad
    private void postLoad() {

        this.accountType = getDiscriminatorValue();
    }
    private String getDiscriminatorValue() {
        DiscriminatorValue annotation = getClass().getAnnotation(DiscriminatorValue.class);
        if (annotation != null) {
            return annotation.value();
        }
        return null;
    }

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
                ", user=" + (user != null ? user.getId() : "null") + // Customized user representation
                ", balance=" + balance +
                ", id=" + id +
                ", accountType='" + accountType + '\'' +
                ", confirmedByAdmin=" + confirmedByAdmin +
                '}';
    }
}
