package com.till.bank.service;

import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class UserServiceTest {

    @Test
    public void testGenerateIBAN() {
        UserServiceImpl userService = new UserServiceImpl();

        String bankId = "1234";
        String accountNumber = "567890";
        String country = "germany";

        String expectedPrefix = "DE"; // Assuming you want the IBAN to start with "DE"

        String generatedIBAN = userService.generateIBAN(bankId, accountNumber, country);

        // Assert that the generated IBAN starts with the expected prefix
        assertEquals(expectedPrefix, generatedIBAN.substring(0, 2));
    }
}
