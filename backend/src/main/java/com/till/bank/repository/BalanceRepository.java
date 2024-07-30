package com.till.bank.repository;


import com.till.bank.entity.Balance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    List<Balance> findByIbanOrderByDateAsc(String iban);
}
