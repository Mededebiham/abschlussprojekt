package com.till.bank.service;

import com.till.bank.entity.RegistRequest;
import com.till.bank.repository.RegistRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistRequestServiceImpl implements RegistRequestService {

    private final RegistRequestRepository registRequestRepository;

    public RegistRequestServiceImpl(RegistRequestRepository registRequestRepository) {
        this.registRequestRepository = registRequestRepository;
    }

    @Override
    public List<RegistRequest> getAllRegistRequests() {
        return registRequestRepository.findAll();
    }

    @Override
    public RegistRequest getRegistRequestById(String id) {
        return registRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RegistRequest not found with id: " + id));
    }

    @Override
    public RegistRequest createRegistRequest(RegistRequest registRequest) {
        return registRequestRepository.save(registRequest);
    }

    @Override
    public RegistRequest updateRegistRequest(String id, RegistRequest registRequest) {
        RegistRequest existingRegistRequest = registRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RegistRequest not found with id: " + id));

        existingRegistRequest.setUser(registRequest.getUser());
        existingRegistRequest.setDate(registRequest.getDate());
        existingRegistRequest.setApproved(registRequest.isApproved());
        existingRegistRequest.setBankAccount(registRequest.getBankAccount());

        return registRequestRepository.save(existingRegistRequest);
    }

    @Override
    public void deleteRegistRequest(String id) {
        registRequestRepository.deleteById(id);
    }
}
