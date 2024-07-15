package com.till.bank.entity;


import lombok.AllArgsConstructor;
import lombok.Data;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private BankAccount sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    private BankAccount recipient;

    private Date date;
    private String reasonOfTransfer;
    private double sum;
    private boolean isAuthorized;

    // Getters and setters
    // Constructors
    // Other methods
    @Override
    public String toString() {
        return "Transfer{" +
                "id=" + id +
                ", recipient=" + recipient +
                ", sender=" + sender +
                ", date=" + date +
                ", reasonOfTransfer='" + reasonOfTransfer + '\'' +
                ", sum=" + sum +
                ", isAuthorized=" + isAuthorized +
                '}';
    }
}