package com.till.bank.controller;

import com.till.bank.entity.RegistRequest;
import com.till.bank.service.RegistRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrequests")
public class RegistRequestController {

    private final RegistRequestService registRequestService;

    @Autowired
    public RegistRequestController(RegistRequestService registRequestService) {
        this.registRequestService = registRequestService;
    }

    @GetMapping
    public ResponseEntity<List<RegistRequest>> getAllRegistRequests() {
        List<RegistRequest> registRequests = registRequestService.getAllRegistRequests();
        return new ResponseEntity<>(registRequests, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistRequest> getRegistRequestById(@PathVariable Long id) {
        RegistRequest registRequest = registRequestService.getRegistRequestById(id);
        return new ResponseEntity<>(registRequest, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<RegistRequest> createRegistRequest(@RequestBody RegistRequest registRequest) {
        RegistRequest newRegistRequest = registRequestService.createRegistRequest(registRequest);
        return new ResponseEntity<>(newRegistRequest, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistRequest> updateRegistRequest(@PathVariable Long id, @RequestBody RegistRequest registRequest) {
        RegistRequest updatedRegistRequest = registRequestService.updateRegistRequest(id, registRequest);
        return new ResponseEntity<>(updatedRegistRequest, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistRequest(@PathVariable Long id) {
        registRequestService.deleteRegistRequest(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
