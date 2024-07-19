package com.till.bank.service;

import com.till.bank.dto.TransferDto;
import com.till.bank.entity.RegistRequest;
import com.till.bank.entity.Transfer;
import com.till.bank.repository.RegistRequestRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class RegistRequestServiceImpl implements RegistRequestService {


    private final RegistRequestRepository registRequestRepository;

    public RegistRequestServiceImpl(RegistRequestRepository registRequestRepository) {
        this.registRequestRepository = registRequestRepository;
    }

    @Override
    public List<RegistRequest> getAllRegistRequests() {
        List<RegistRequest>list=registRequestRepository.findAll();
        return list;
    }

    @Override
    public RegistRequest getRegistRequestById(Long id) {
        return registRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("RegistRequest not found with id: " + id));
    }

    @Override
    public RegistRequest createRegistRequest(RegistRequest registRequest) {
        return registRequestRepository.save(registRequest);

    }

    @Override
    public RegistRequest updateRegistRequest(Long id, RegistRequest registRequest) {
        Optional<RegistRequest> registRequest1=registRequestRepository.findById(id);
        registRequest1.orElseThrow().setUser(registRequest.getUser());
        registRequest1.orElseThrow().setDate(registRequest.getDate());
        return registRequest1.orElseThrow();
    }

    @Override
    public void deleteRegistRequest(Long id) {
        registRequestRepository.deleteById(id);
    }
}
