package com.till.bank.repository;

import com.till.bank.entity.BankAccount;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankAccountRepository extends MongoRepository<BankAccount, String> {
    BankAccount findByAccountNumber(String accountNumber);
    BankAccount findByIBAN(String IBAN);

    List<BankAccount> findByUser_Id(String userId);

    Optional<List<BankAccount>> findByUserId(String userId);
}
