package com.till.bank.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "Street is mandatory")
    private String street;

    @NotBlank(message = "Street Number is mandatory")
    private String streetNumber;

    @NotBlank(message = "City is mandatory")
    private String city;

    @NotBlank(message = "Zip Code is mandatory")
    @Pattern(regexp = "^[0-9]{5}(?:-[0-9]{4})?$", message = "Zip Code must be valid")
    private String zipCode;

    @NotBlank(message = "Country is mandatory")
    private String country;

    public Address(String street, String streetNumber, String city, String zipCode, String country) {
        this.street = street;
        this.streetNumber = streetNumber;
        this.city = city;
        this.zipCode = zipCode;
        this.country = country;
    }
}
