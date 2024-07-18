package com.till.bank.service;

import com.till.bank.dto.TransferDto;
import com.till.bank.entity.RegistRequest;
import com.till.bank.entity.Transfer;

import java.util.List;

public interface RegistRequestService {
    List<RegistRequest> getAllRegistRequests();

    RegistRequest getRegistRequestById(Long id);

    RegistRequest createRegistRequest(RegistRequest registRequest);

    RegistRequest updateRegistRequest(Long id, RegistRequest registRequest);

    void deleteRegistRequest(Long id);
}
