package com.till.bank.repository;

import com.till.bank.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {
    List<Transfer> findBySender_Id(Long senderId);
    List<Transfer> findByRecipient_Id(Long recipientId);
}
