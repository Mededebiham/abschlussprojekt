package com.till.bank.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Entity
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegistRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date date;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnore
    private User1 user;

    private boolean isApproved;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_account_id", referencedColumnName = "id")
    @JsonIgnore
    private BankAccount bankAccount;

    public RegistRequest(Date date, User1 savedUser, BankAccount savedBankAccount) {
        this.date = date;
        this.user = savedUser;
        this.bankAccount = savedBankAccount;
        this.isApproved = false;
    }
}
