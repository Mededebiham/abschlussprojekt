package com.till.bank.dto;

import com.till.bank.entity.BankAccount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferDto {

    private Long id;
    private BankAccountDto recipient;
    private BankAccountDto sender;
    private Date date;
    private String reasonOfTransfer;
    private double sum;
    private boolean isAuthorized=false;

    // Getters and setters
    // Constructors
    // Other methods

    @Override
    public String toString() {
        return "TransferDto{" +
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
