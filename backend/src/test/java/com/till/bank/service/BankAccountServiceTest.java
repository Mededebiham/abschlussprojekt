//package com.till.bank.service;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//import static org.mockito.ArgumentMatchers.any;
//import static org.mockito.ArgumentMatchers.anyString;
//import static org.mockito.Mockito.mock;
//import static org.mockito.Mockito.when;
//
//import com.till.bank.dto.BankAccountDto;
//import com.till.bank.entity.BankAccount;
//import com.till.bank.service.BankAccountService;
//import org.junit.jupiter.api.Test;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//
//public class BankAccountServiceTest {
//
//    @Test
//    public void testGetBankAccountByAccNumber() {
//        // Mock the service class
//        BankAccountService bankAccountService = mock(BankAccountService.class);
//        BankAccount bankAccount = new BankAccount(/* provide necessary parameters */);
//        ResponseEntity<BankAccount> responseEntity = ResponseEntity.ok(bankAccount);
//        when(bankAccountService.getBankAccountByAccNumbOrIBAN(any())).thenReturn(responseEntity);
//
//        // Create a BankAccountDto with account number
//        BankAccountDto bankAccountDto = new BankAccountDto();
//        bankAccountDto.setAccountNumber("1234567890");
//        bankAccountDto.setIBAN(""); // Set IBAN to empty string
//
//        // Call the service method
//        ResponseEntity<?> actualResponseEntity = bankAccountService.getBankAccountByAccNumbOrIBAN(bankAccountDto);
//
//        // Verify that the response entity is not null
//        assertNotNull(actualResponseEntity);
//
//        // Verify that the response status is OK
//        assertEquals(HttpStatus.OK, actualResponseEntity.getStatusCode());
//
//        // Verify that the response body is the expected bank account
//        assertEquals(bankAccount, actualResponseEntity.getBody());
//    }
//
//    // More test cases for other scenarios...
//}