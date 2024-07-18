package com.till.bank.repository;
import com.till.bank.entity.Address;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.CheckingAccount;
import com.till.bank.entity.User1;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DataJpaTest
public class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;



    @Test
    public void testFindByEmail() {
        // Mocking the behavior of UserRepository
        Address address = new Address("123 Main St", "Apt 101", "City", "12345", "Country");

        BankAccount bankAccount = new CheckingAccount("Bank1", "1234567890", "IBAN123", null, 1000.0); // Set user to null for now

        User1 user = new User1("First", "Last", "test@example.com", "password", "0584874474", "user", address, bankAccount);

        // Set the user for the bank account
        bankAccount.setUser(user);

        System.out.println(user);

       // User1 user = new User1("first","last","test@example.com", "password","0584874474","user",null,null);

        when(userRepository.findByEmail("test@example.com")).thenReturn(user);

        // Calling the method under test
        User1 foundUser = userRepository.findByEmail("test@example.com");

        // Verifying the result
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getEmail()).isEqualTo("test@example.com");
    }

    @Test
    public void testExistsByEmail() {
        // Mocking the behavior of UserRepository
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Calling the method under test
        boolean exists = userRepository.existsByEmail("test@example.com");

        // Verifying the result
        assertThat(exists).isTrue();
    }
}
