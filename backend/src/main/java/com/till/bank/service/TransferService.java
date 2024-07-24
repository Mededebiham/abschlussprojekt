package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TransferService {

    List<TransferDto> getAllTransfers();

    Transfer getTransferById(Long id);

    Transfer createTransfer(TransferDto transferDto);

    Transfer updateTransfer(Long id, TransferDto transferDto);

    void deleteTransfer(Long id);

    List<TransferDto> getAllTransfersOfABankAccount(Long bankAccountId);

    List<TransferDto> getAllPayoutsOfABankAccount(Long bankAccountId);

    List<TransferDto> getAllDepositsOfABankAccount(Long bankAccountId);

    BankAccountDto convertBAToBADto(BankAccount bankAccount);

    TransferDto convertTToTDto(Transfer transfer);

    // Neue Methoden zum Verarbeiten der Datei und Extrahieren der IBAN
    String processFile(MultipartFile file) throws IOException;

    String extractIban(String extractedText);
}
