package com.till.bank.dto;

import com.till.bank.entity.Address;
import com.till.bank.entity.BankAccount;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private String id;

    @NotBlank(message = "First Name is mandatory")
    @Pattern(regexp = "^[a-zA-Z]*$", message = "First Name must contain only letters")
    private String firstName;

    @NotBlank(message = "Last Name is mandatory")
    private String lastName;

    @NotBlank(message = "Email is mandatory")
    @Email(message="Email must be valid")
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 3, message = "Password must be at least 3 characters long")
    private String password;

    @NotBlank(message = "Phone number is mandatory")
    private String phoneNumber;

    @NotBlank(message = "Role is mandatory")
    private String role;

    private Address address; // Embedded documents should be handled properly

    private BankAccount bankAccount; // Embedded documents should be handled properly

    private boolean confirmedByAdmin;
}
