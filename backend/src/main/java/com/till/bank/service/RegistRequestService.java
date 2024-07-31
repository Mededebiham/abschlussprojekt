package com.till.bank.service;

import com.till.bank.entity.RegistRequest;

import java.util.List;

public interface RegistRequestService {
    List<RegistRequest> getAllRegistRequests();

    RegistRequest getRegistRequestById(String id);

    RegistRequest createRegistRequest(RegistRequest registRequest);

    RegistRequest updateRegistRequest(String id, RegistRequest registRequest);

    void deleteRegistRequest(String id);
}
