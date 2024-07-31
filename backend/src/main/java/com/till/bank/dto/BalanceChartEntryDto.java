package com.till.bank.dto;

import java.util.Date;

public class BalanceChartEntryDto {
    private String date;
    private double balance;

    public BalanceChartEntryDto(String date, double balance) {
        this.date = date;
        this.balance = balance;
    }

    // Getters and setters
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
