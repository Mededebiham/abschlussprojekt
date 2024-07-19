package com.till.bank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import static jakarta.persistence.DiscriminatorType.STRING;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
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

    @Column(name = "account_type", nullable = false)
    private String accountType;

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
                ", accountType='" + accountType + '\'' +
                ", confirmedByAdmin=" + confirmedByAdmin +
                '}';
    }
}
