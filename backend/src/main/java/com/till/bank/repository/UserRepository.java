package com.till.bank.repository;

import com.till.bank.entity.User1;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User1, String> {
    User1 findByEmail(String email);

    boolean existsByEmail(String email);
}
