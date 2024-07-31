package com.till.bank.repository;

import com.till.bank.entity.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddressRepository extends MongoRepository<Address, String> {
    // Additional methods for custom queries can be defined here
}
