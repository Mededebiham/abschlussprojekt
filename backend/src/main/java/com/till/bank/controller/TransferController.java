package com.till.bank.controller;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.Transfer;
import com.till.bank.service.TransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/transfers")
@CrossOrigin(origins = "http://localhost:3000")
public class TransferController {
    private String lastCode = null;
    private boolean isVerified = false;
    private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
    private SseEmitter sseEmitter = new SseEmitter();
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
    @CrossOrigin
    @GetMapping("/events")
    public SseEmitter events() {
        return sseEmitter;
    }
    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestBody CodeRequest codeRequest) {
        lastCode = codeRequest.getCode();
        isVerified = false;

        scheduler.shutdownNow();
        scheduler = Executors.newScheduledThreadPool(1);
        scheduler.schedule(() -> lastCode = null, 60, TimeUnit.SECONDS);

        try {
            sseEmitter.send(SseEmitter.event().data("{\"code\":\"" + lastCode + "\"}"));
        } catch (IOException e) {
            sseEmitter.completeWithError(e);
        }

        return new ResponseEntity<>("Code sent", HttpStatus.OK);
    }
    @PostMapping("/verify-code")
    public ResponseEntity<VerificationResponse> verifyCode(@RequestBody CodeRequest codeRequest) {
        VerificationResponse response = new VerificationResponse();
        if (isVerified) {
            response.setMessage("Code already used.");
        } else if (codeRequest.getCode().equals(lastCode)) {
            lastCode = null;
            isVerified = true;
            scheduler.shutdownNow();
            response.setMessage("Code verified successfully!");
        } else {
            response.setMessage("Invalid code. Please try again.");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    static class CodeRequest {
        private String code;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    static class VerificationResponse {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
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

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = transferService.processFile(file);
            String iban = transferService.extractIban(extractedText);
            String empfaenger = transferService.empfaengerExtractor(extractedText);
            String betrag = transferService.betragExtractor(extractedText);

            Map<String, String> response = new HashMap<>();
            response.put("iban", iban);
            response.put("empfaenger", empfaenger);
            response.put("betrag", betrag);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(Collections.singletonMap("error", "File upload failed: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PostMapping("/betragExtractor")
    public ResponseEntity<String> betragExtractor(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = transferService.processFile(file);
            String betrag = transferService.betragExtractor(extractedText);
            return new ResponseEntity<>(betrag, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Betrag extraction failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/empfaengerExtractor")
    public ResponseEntity<String> empfaengerExtractor(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = transferService.processFile(file);
            String empfaenger = transferService.empfaengerExtractor(extractedText);
            return new ResponseEntity<>(empfaenger, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>("Empfänger extraction failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


}
