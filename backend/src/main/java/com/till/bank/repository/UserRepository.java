package com.till.bank.repository;


import com.till.bank.entity.User1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User1, Long> {
    User1 findByEmail(String email);

    boolean existsByEmail(String email);


}
