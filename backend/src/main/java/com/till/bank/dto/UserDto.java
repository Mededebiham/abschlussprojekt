package com.till.bank.dto;

import com.till.bank.entity.Address;
import com.till.bank.entity.BankAccount;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String firstName;

    private String lastName;

    private String email;

    private String password;

    private String phoneNumber;

    private String role;


    private Address address;

    private BankAccount bankAccount;
}
