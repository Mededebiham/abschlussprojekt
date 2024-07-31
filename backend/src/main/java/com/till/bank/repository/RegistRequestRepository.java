package com.till.bank.repository;
import com.till.bank.entity.RegistRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RegistRequestRepository extends MongoRepository<RegistRequest, String> {
}
