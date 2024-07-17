package com.till.bank.repository;

import com.till.bank.entity.RegistRequest;
import com.till.bank.entity.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistRequestRepository extends JpaRepository<RegistRequest, Long> {

}
