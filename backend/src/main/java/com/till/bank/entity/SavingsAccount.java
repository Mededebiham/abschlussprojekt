package com.till.bank.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@DiscriminatorValue("Sparkonto")
public class SavingsAccount extends BankAccount{
    private BigDecimal interestRate;

}
