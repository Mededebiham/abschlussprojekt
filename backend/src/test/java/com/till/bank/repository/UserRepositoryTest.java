package com.till.bank.repository;

import com.till.bank.entity.*;
import com.till.bank.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@DataJpaTest
public class UserRepositoryTest {

    //@Autowired
    private UserRepository userRepository;

    @Test
    void testFindByEmail1() {
        // Arrange
        String email = "yasin@gmail.com";
        User1 user = new User1();
        user.setEmail(email);
        userRepository.save(user);

        // Act
        User1 foundUser = userRepository.findByEmail(email);

        // Assert
        assertThat(foundUser).isNotNull();
        assertThat(foundUser.getEmail()).isEqualTo(email);
    }
    @Test
    public void testFindById() {
        User1 user = userRepository.findById("1").orElse(null);
        assertNotNull(user);
    }
    @Test
    public void testFindBankAccounts(){
        // Fetch the user from the repository
// Create a new user
        User1 user = new User1();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPassword("password");
        user.setPhoneNumber("1234567890");
        user.setRole("USER");
        user.setAddress(new Address(" Main St","1232", "City", "State", "12345"));


// Save the user (this will also save the bank account due to cascade settings)
        userRepository.save(user);
// Create new bank accounts and associate them with the user
        BankAccount account1 = new CheckingAccount();
        account1.setBankId("123");
        account1.setAccountNumber("456789");
        account1.setIBAN("IL443314318865610");
        account1.setUser(user);
        account1.setBalance(1000.0);
        account1.setAccountType("CheckingAccount");

        BankAccount account2 = new SavingsAccount();
        account2.setBankId("456");
        account2.setAccountNumber("123456");
        account2.setIBAN("IL443314318865611");
        account2.setUser(user);
        account2.setBalance(2000.0);
        account2.setAccountType("SavingsAccount");

// Add the new bank accounts to the user's bank accounts list
        user.getBankAccounts().add(account1);
        user.getBankAccounts().add(account2);

// Save the user (this will also save the bank accounts due to cascade settings)
        userRepository.save(user);
        // Fetch the user and their bank accounts
        User1 user2 = userRepository.findById("1").orElseThrow(() -> new RuntimeException("User not found"));
        List<BankAccount> bankAccounts = user2.getBankAccounts();

        for (BankAccount account : bankAccounts) {
            System.out.println("Bank Account ID: " + account.getId());
            System.out.println("Bank Account Type: " + account.getAccountType());
            System.out.println("Bank Account Balance: " + account.getBalance());
        }
        assertNotNull(user2);

    }

    @Test
    public void testFindByEmail() {
        // Mocking the behavior of UserRepository
        Address address = new Address("123 Main St", "Apt 101", "City", "12345", "Country");

        BankAccount bankAccount = new CheckingAccount(); // Set user to null for now

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
