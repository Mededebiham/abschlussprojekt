package com.till.bank.repository;

import com.till.bank.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BankAccountRepository  extends JpaRepository<BankAccount, Long> {
    BankAccount findByAccountNumber(String accountNumber);
    BankAccount findByIBAN(String IBAN);

    Optional<BankAccount> findByUser_Id(Long user_id);

}

