package com.till.bank.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "transfers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transfer {

    @Id
    private String id;

    private BankAccount sender;

    private BankAccount recipient;

    private Date date;

    private String reasonOfTransfer;

    private double sum;

    private boolean isAuthorized;

    @Override
    public String toString() {
        return "Transfer{" +
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
