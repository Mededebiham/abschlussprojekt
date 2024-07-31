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

    Transfer getTransferById(String id);

    Transfer createTransfer(TransferDto transferDto);

    Transfer updateTransfer(String id, TransferDto transferDto);

    void deleteTransfer(String id);

    List<TransferDto> getAllTransfersOfABankAccount(String bankAccountId);

    List<TransferDto> getAllPayoutsOfABankAccount(String bankAccountId);

    List<TransferDto> getAllDepositsOfABankAccount(String bankAccountId);

    BankAccountDto convertBAToBADto(BankAccount bankAccount);

    TransferDto convertTToTDto(Transfer transfer);

    String processFile(MultipartFile file) throws IOException;

    String extractIban(String extractedText);

    String empfaengerExtractor(String extractedText);

    String betragExtractor(String extractedBetrag);
}
