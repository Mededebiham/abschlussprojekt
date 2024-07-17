package com.till.bank.entity;


import lombok.AllArgsConstructor;
import lombok.Data;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.Date;
import jakarta.validation.constraints.NotBlank;

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
    @NotBlank(message = "Sender is mandatory")
    private BankAccount sender;

    @ManyToOne
    @JoinColumn(name = "recipient_id")
    @NotBlank(message = "Recipient is mandatory")
    private BankAccount recipient;

    @NotBlank(message = "Date is mandatory")
    private Date date;

    @NotBlank(message = "Reason Of transfer is mandatory")
    private String reasonOfTransfer;

    @NotBlank(message = "Sum is mandatory")
    private double sum;

    @NotBlank(message = "Authorization status is mandatory")
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