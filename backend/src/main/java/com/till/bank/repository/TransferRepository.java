package com.till.bank.repository;

import com.till.bank.entity.Transfer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends MongoRepository<Transfer, String> {
    List<Transfer> findBySender_Id(String senderId);
    List<Transfer> findByRecipient_Id(String recipientId);
}
