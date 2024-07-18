package com.till.bank.service;

import com.till.bank.dto.TransferDto;
import com.till.bank.entity.RegistRequest;
import com.till.bank.entity.Transfer;
import com.till.bank.repository.RegistRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class RegistRequestServiceImpl implements RegistRequestService {


    private RegistRequestRepository registRequestRepository;

    public RegistRequestServiceImpl(RegistRequestRepository registRequestRepository) {
        this.registRequestRepository = registRequestRepository;
    }

    @Override
    public List<RegistRequest> getAllRegistRequests() {

        return List.of();
    }

    @Override
    public RegistRequest getRegistRequestById(Long id) {
        return null;
    }

    @Override
    public RegistRequest createRegistRequest(RegistRequest registRequest) {
        return null;
    }

    @Override
    public RegistRequest updateRegistRequest(Long id, RegistRequest registRequest) {
        return null;
    }

    @Override
    public void deleteRegistRequest(Long id) {

    }
}
