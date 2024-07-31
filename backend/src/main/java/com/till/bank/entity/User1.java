package com.till.bank.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
@Document(collection = "user1")
public class User1 {

    @Id
    private String id; // MongoDB verwendet String für IDs

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

    @Field(name = "confirmed_by_admin")
    private boolean confirmedByAdmin = false;

    @DBRef
    private Address address;

    @DBRef
    private List<BankAccount> bankAccounts = new ArrayList<>();

    // Default constructor
    public User1() {}

    // Constructor with parameters
    public User1(String firstName, String lastName, String email, String password, String phoneNumber, String role, Address address, BankAccount bankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.address = address;
        this.bankAccounts.add(bankAccount);
    }

    public User1(String firstName, String lastName, String email, String password, String phoneNumber, String role, Address address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.address = address;
    }

    // Getters and Setters
}
