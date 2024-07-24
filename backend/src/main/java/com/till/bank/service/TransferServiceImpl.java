package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.TransferRepository;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Slf4j
public class TransferServiceImpl implements TransferService {

    @Autowired
    private PlatformTransactionManager transactionManager;

    private final TransferRepository transferRepository;
    private final BankAccountRepository bankAccountRepository;

    @Autowired
    public TransferServiceImpl(TransferRepository transferRepository,
                               BankAccountRepository bankAccountRepository) {
        this.transferRepository = transferRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    public List<TransferDto> getAllTransfers() {
        List<Transfer> transfers = transferRepository.findAll();
        if (transfers != null) {
            List<TransferDto> transfersDto = new ArrayList<>();
            for (Transfer transfer : transfers) {
                transfersDto.add(convertTToTDto(transfer));
            }
            return transfersDto;
        } else {
            return null;
        }
    }

    @Override
    public Transfer getTransferById(Long id) {
        return transferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfer not found with id: " + id));
    }

    @Override
    public List<TransferDto> getAllTransfersOfABankAccount(Long bankAccountId) {
        List<TransferDto> transferDtos = new ArrayList<>();
        List<Transfer> transfersSent = transferRepository.findBySender_Id(bankAccountId);
        List<Transfer> transfersReceived = transferRepository.findByRecipient_Id(bankAccountId);

        for (Transfer transfer : transfersSent) {
            transferDtos.add(convertTToTDto(transfer));
        }
        for (Transfer transfer : transfersReceived) {
            transferDtos.add(convertTToTDto(transfer));
        }
        log.info("All Transfers: {}", transferDtos);
        return transferDtos;
    }

    @Override
    public List<TransferDto> getAllDepositsOfABankAccount(Long bankAccountId) {
        List<TransferDto> transferDtos = new ArrayList<>();
        List<Transfer> transfersReceived = transferRepository.findByRecipient_Id(bankAccountId);

        for (Transfer transfer : transfersReceived) {
            transferDtos.add(convertTToTDto(transfer));
        }
        log.info("All Deposits: {}", transferDtos);
        return transferDtos;
    }

    @Override
    public List<TransferDto> getAllPayoutsOfABankAccount(Long bankAccountId) {
        List<TransferDto> transferDtos = new ArrayList<>();
        List<Transfer> transfersSent = transferRepository.findBySender_Id(bankAccountId);

        for (Transfer transfer : transfersSent) {
            transferDtos.add(convertTToTDto(transfer));
        }
        log.info("All Payouts: {}", transferDtos);
        return transferDtos;
    }

    @Override
    public Transfer createTransfer(TransferDto transferDto) {
        if (transferDto.getRecipient() == null || transferDto.getSender() == null) {
            throw new IllegalArgumentException("Recipient and sender IDs must not be null.");
        }
        Optional<BankAccount> bankAccountRecipient = bankAccountRepository.findById(transferDto.getRecipient().getId());
        Optional<BankAccount> bankAccountSender = bankAccountRepository.findById(transferDto.getSender().getId());

        Transfer transfer = new Transfer();
        transfer.setReasonOfTransfer(transferDto.getReasonOfTransfer());
        transfer.setAuthorized(false);
        transfer.setDate(transferDto.getDate());
        transfer.setRecipient(bankAccountRecipient.orElse(null));
        transfer.setSender(bankAccountSender.orElse(null));
        transfer.setSum(transferDto.getSum());

        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            bankAccountRecipient.orElseThrow().setBalance(bankAccountRecipient.orElseThrow().getBalance() + transferDto.getSum());
            bankAccountRepository.save(bankAccountRecipient.orElseThrow());

            bankAccountSender.orElseThrow().setBalance(bankAccountSender.orElseThrow().getBalance() - transferDto.getSum());
            bankAccountRepository.save(bankAccountSender.orElseThrow());

            return transferRepository.save(transfer);
        });

        return transferRepository.save(transfer);
    }

    @Override
    public Transfer updateTransfer(Long id, TransferDto transferDto) {
        log.info("TRANSFER DTO BEFORE SAVING" + transferDto);
        Optional<Transfer> optionalTransfer = transferRepository.findById(id);

        if (optionalTransfer.isPresent()) {
            Transfer existingTransfer = optionalTransfer.get();

            existingTransfer.setReasonOfTransfer(transferDto.getReasonOfTransfer());
            existingTransfer.setAuthorized(transferDto.isAuthorized());
            existingTransfer.setDate(transferDto.getDate());
            existingTransfer.setSum(transferDto.getSum());

            log.info("TRANSFER AFTER SAVING THE DTO" + existingTransfer);
            return transferRepository.save(existingTransfer);
        } else {
            throw new RuntimeException("Transfer not found with id: " + id);
        }
    }

    @Override
    public void deleteTransfer(Long id) {
        transferRepository.deleteById(id);
    }

    @Override
    public BankAccountDto convertBAToBADto(BankAccount bankAccount) {
        BankAccountDto bankAccountDto = new BankAccountDto();
        bankAccountDto.setAccountNumber(bankAccount.getAccountNumber());
        bankAccountDto.setUser(bankAccount.getUser());
        bankAccountDto.setIBAN(bankAccount.getIBAN());
        bankAccountDto.setBankId(bankAccount.getBankId());
        bankAccountDto.setBalance(bankAccount.getBalance());
        bankAccountDto.setAccountType(bankAccount.getAccountType());
        bankAccountDto.setConfirmedByAdmin(bankAccount.isConfirmedByAdmin());
        return bankAccountDto;
    }

    @Override
    public TransferDto convertTToTDto(Transfer transfer) {
        log.info("TRANSFER BEFORE CONVERTING" + transfer);
        TransferDto transferDto = new TransferDto();
        transferDto.setId(transfer.getId());
        transferDto.setSender(convertBAToBADto(transfer.getSender()));
        transferDto.setRecipient(convertBAToBADto(transfer.getRecipient()));
        transferDto.setReasonOfTransfer(transfer.getReasonOfTransfer());
        transferDto.setAuthorized(transfer.isAuthorized());
        transferDto.setSum(transfer.getSum());
        transferDto.setDate(transfer.getDate());
        return transferDto;
    }

    @Override
    public String processFile(MultipartFile file) throws IOException {
        Path tempDir = Files.createTempDirectory("upload");
        Path tempFile = tempDir.resolve(file.getOriginalFilename());
        file.transferTo(tempFile.toFile());

        Tesseract tesseract = new Tesseract();
        tesseract.setDatapath(Paths.get("src/main/resources/tessdata").toString());

        return "DE9192838393";
//        try {
//            return tesseract.doOCR(tempFile.toFile());
//        } catch (TesseractException e) {
//            throw new IOException("Error processing file", e);
//        } finally {
//            Files.delete(tempFile);
//            Files.delete(tempDir);
//        }
    }

    @Override
    public String extractIban(String text) {
        String ibanRegex = "\\b[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}\\b";
        Pattern pattern = Pattern.compile(ibanRegex);
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group();
        } else {
            return "Bitte IBAN eingeben";
        }
    }
}
