package com.till.bank.entity;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "user1",
        uniqueConstraints = @UniqueConstraint(columnNames = "email")
)
public class User1 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    private String role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_account", referencedColumnName = "id")
    private BankAccount bankAccount;

    public User1(String firstName, String lastName, String email, String password, String phoneNumber, String role, Address address,BankAccount bankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.address = address;
        this.bankAccount=bankAccount;}
}
