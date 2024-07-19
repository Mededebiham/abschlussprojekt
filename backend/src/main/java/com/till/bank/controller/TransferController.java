package com.till.bank.controller;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.Transfer;
import com.till.bank.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {

    private final TransferService transferService;

    @Autowired
    public TransferController(TransferService transferService) {
        this.transferService = transferService;
    }

    @GetMapping
    public ResponseEntity<List<TransferDto>> getAllTransfers() {
        List<TransferDto> transfers = transferService.getAllTransfers();
        return new ResponseEntity<>(transfers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transfer> getTransferById(@PathVariable Long id) {
        Transfer transfer = transferService.getTransferById(id);
        return new ResponseEntity<>(transfer, HttpStatus.OK);
    }

    @GetMapping("/bankAccount/transfers/{bankAccountId}")
    public ResponseEntity<List<TransferDto>> getAllTransfersOfABankAccount(@PathVariable Long bankAccountId) {
        List<TransferDto> transfers = transferService.getAllTransfersOfABankAccount(bankAccountId);
        return new ResponseEntity<>(transfers, HttpStatus.OK);
    }

    @GetMapping("/bankAccount/deposits/{bankAccountId}")
    public ResponseEntity<List<TransferDto>> getAllDepositsOfABankAccount(@PathVariable Long bankAccountId) {
        List<TransferDto> transfers = transferService.getAllDepositsOfABankAccount(bankAccountId);
        return new ResponseEntity<>(transfers, HttpStatus.OK);
    }

    @GetMapping("/bankAccount/payouts/{bankAccountId}")
    public ResponseEntity<List<TransferDto>> getAllPayoutsOfABankAccount(@PathVariable Long bankAccountId) {
        List<TransferDto> transfers = transferService.getAllPayoutsOfABankAccount(bankAccountId);
        return new ResponseEntity<>(transfers, HttpStatus.OK);
    }


    @PostMapping
    public ResponseEntity<TransferDto> createTransfer(@RequestBody TransferDto transferDto) {
        Transfer createdTransfer = transferService.createTransfer(transferDto);
        TransferDto transferDtoCreated= new TransferDto();
        transferDtoCreated.setReasonOfTransfer(createdTransfer.getReasonOfTransfer());
        transferDtoCreated.setAuthorized(false);
        transferDtoCreated.setDate(createdTransfer.getDate());

        transferDtoCreated.setRecipient(transferService.convertBAToBADto(createdTransfer.getRecipient()));

        transferDtoCreated.setSender(transferService.convertBAToBADto(createdTransfer.getSender()));
        transferDtoCreated.setSum(transferDto.getSum());
        return new ResponseEntity<>(transferDtoCreated, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transfer> updateTransfer(@PathVariable Long id, @RequestBody TransferDto transferDto) {
        Transfer updatedTransfer = transferService.updateTransfer(id, transferDto);
        return new ResponseEntity<>(updatedTransfer, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransfer(@PathVariable Long id) {
        transferService.deleteTransfer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
