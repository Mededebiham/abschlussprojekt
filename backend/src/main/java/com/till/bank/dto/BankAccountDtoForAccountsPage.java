package com.till.bank.dto;

import com.till.bank.entity.User1;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankAccountDtoForAccountsPage {
    private String accountType;
    private String IBAN;
    private User1 user;
    private double balance;

}
