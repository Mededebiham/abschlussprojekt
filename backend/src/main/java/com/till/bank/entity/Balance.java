package com.till.bank.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@Entity
@Table(name = "balance")
public class Balance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String iban;
    private Date date;
    private double balanceAmount;

    public Balance() {}

    public Balance(String iban, Date date, double balance) {
        this.iban = iban;
        this.date = date;
        this.balanceAmount = balance;
    }

}
