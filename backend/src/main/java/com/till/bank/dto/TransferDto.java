package com.till.bank.dto;

import com.till.bank.entity.BankAccount;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferDto {

    private Long id;
    private boolean isAuthorized=false;


    @NotBlank(message = "Sender is mandatory")
    private BankAccountDto sender;


    @NotBlank(message = "Recipient is mandatory")
    private BankAccountDto recipient;

    @NotBlank(message = "Date is mandatory")
    private Date date;

    @NotBlank(message = "Reason Of transfer is mandatory")
    private String reasonOfTransfer;

    @NotBlank(message = "Sum is mandatory")
    private double sum;


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
