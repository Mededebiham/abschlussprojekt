package com.till.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@ToString
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationRequest {
    private UserDto userDto;
    private double balance;
    private String account_type;


}
