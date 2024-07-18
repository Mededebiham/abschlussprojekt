package com.till.bank.controller;

import com.till.bank.entity.RegistRequest;
import com.till.bank.service.RegistRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registrequests")
@CrossOrigin(origins = "http://localhost:3000")
public class RegistRequestController {

    private  RegistRequestService registRequestService;

    @Autowired
    public RegistRequestController(RegistRequestService registRequestService) {
        this.registRequestService = registRequestService;
    }
    @GetMapping
    public List<RegistRequest> getAll() {
        return registRequestService.getAllRegistRequests();
    }
    @GetMapping("/{id}")
    public RegistRequest getById(@PathVariable Long id) {
        return registRequestService.getRegistRequestById(id);
    }
    @PostMapping
    public RegistRequest create(@RequestBody RegistRequest registRequest) {
        return registRequestService.createRegistRequest(registRequest);
    }
    @PutMapping("/{id}")
    public RegistRequest update(@PathVariable Long id,@RequestBody RegistRequest registRequest) {
        return registRequestService.updateRegistRequest(id,registRequest);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        registRequestService.deleteRegistRequest(id);
    }
}
