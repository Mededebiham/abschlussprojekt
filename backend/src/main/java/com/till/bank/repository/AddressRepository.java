package com.till.bank.repository;

import com.till.bank.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
    // Additional methods for custom queries can be defined here
}