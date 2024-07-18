package com.till.bank.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    @NotBlank(message = "Street is mandatory")
    private String street;

    @NotBlank(message = "Street Number is mandatory")
    private String streetNumber;

    @NotBlank(message = "City is mandatory")
    private String city;

    @NotBlank(message = "Zip Code is mandatory")
    private String zipCode;

    @NotBlank(message = "Country is mandatory")
    private String country;

}
