package com.till.bank.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.util.Date;

@Document(collection = "registRequests")
@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegistRequest {
    @Id
    private String id;
    private Date date;

    @DBRef
    private User1 user;

    private boolean isApproved;

    @DBRef
    private BankAccount bankAccount;

    public RegistRequest(Date date, User1 savedUser, BankAccount savedBankAccount) {
        this.date = date;
        this.user = savedUser;
        this.bankAccount = savedBankAccount;
        this.isApproved = false;
    }
}
