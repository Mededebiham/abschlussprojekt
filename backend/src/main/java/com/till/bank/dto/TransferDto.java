package com.till.bank.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferDto {

    private String id; // MongoDB verwendet String für die ID

    private boolean isAuthorized = false;

    @NotNull(message = "Sender is mandatory")
    private BankAccountDto sender;

    @NotNull(message = "Recipient is mandatory")
    private BankAccountDto recipient;

    @NotNull(message = "Date is mandatory")
    private Date date;

    @NotNull(message = "Reason of transfer is mandatory")
    private String reasonOfTransfer;

    @NotNull(message = "Sum is mandatory")
    private double sum;

    @Override
    public String toString() {
        return "TransferDto{" +
                "id='" + id + '\'' +
                ", recipient=" + recipient +
                ", sender=" + sender +
                ", date=" + date +
                ", reasonOfTransfer='" + reasonOfTransfer + '\'' +
                ", sum=" + sum +
                ", isAuthorized=" + isAuthorized +
                '}';
    }
}
