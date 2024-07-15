package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.TransferRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
        List<Transfer> transfers= transferRepository.findAll();
        if(transfers != null){
            List<TransferDto> transfersDto=new ArrayList<>();
            for(Transfer transfer : transfers){
                transfersDto.add(convertTToTDto(transfer));
            }
            return transfersDto;
        }else{
            return null;
        }
    }

    @Override
    public Transfer getTransferById(Long id) {
        return transferRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transfer not found with id: " + id));
    }

    @Override
    public Transfer createTransfer(TransferDto transferDto) {
        //if recipient or sender are null
        if (transferDto.getRecipient() == null || transferDto.getSender() == null) {
            throw new IllegalArgumentException("Recipient and sender IDs must not be null.");
        }
        // Get the recipient bankAccount
        Optional<BankAccount> bankAccountRecipient = bankAccountRepository.findById(transferDto.getRecipient().getId());
        // Get the sender bankAccount
        Optional<BankAccount> bankAccountSender = bankAccountRepository.findById(transferDto.getSender().getId());

        Transfer transfer = new Transfer();
        transfer.setReasonOfTransfer(transferDto.getReasonOfTransfer());
        transfer.setAuthorized(false);
        transfer.setDate(transferDto.getDate());
        transfer.setRecipient(bankAccountRecipient.orElse(null)); // Extract BankAccount or null if not present
        transfer.setSender(bankAccountSender.orElse(null)); // Extract BankAccount or null if not present
        transfer.setSum(transferDto.getSum());

        //update the balance of the two accounts
        TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
        transactionTemplate.execute(status -> {
            // Update the balance of the recipient account
            bankAccountRecipient.orElseThrow().setBalance(bankAccountRecipient.orElseThrow().getBalance() + transferDto.getSum());
            bankAccountRepository.save(bankAccountRecipient.orElseThrow());

            // Update the balance of the sender account
            bankAccountSender.orElseThrow().setBalance(bankAccountSender.orElseThrow().getBalance() - transferDto.getSum());
            bankAccountRepository.save(bankAccountSender.orElseThrow());

            // Create and save the transfer entity
            return transferRepository.save(transfer);
        });


        return transferRepository.save(transfer);
    }


    @Override
    public Transfer updateTransfer(Long id, TransferDto transferDto) {
        // Retrieve the transfer by id
        log.info("TRANSFER DTO BEFORE SAVING"+transferDto);
        Optional<Transfer> optionalTransfer = transferRepository.findById(id);

        if (optionalTransfer.isPresent()) {
            Transfer existingTransfer = optionalTransfer.get();

            // Update transfer properties from DTO
            existingTransfer.setReasonOfTransfer(transferDto.getReasonOfTransfer());
            existingTransfer.setAuthorized(transferDto.isAuthorized());
            existingTransfer.setDate(transferDto.getDate());
            existingTransfer.setSum(transferDto.getSum());

            // Save the updated transfer
            log.info("TRANSFER  AFTER SAVING THE DTO"+existingTransfer);
            return transferRepository.save(existingTransfer);
        } else {
            // Handle case where transfer with given id is not found
            throw new RuntimeException("Transfer not found with id: " + id);
        }
    }


    @Override
    public void deleteTransfer(Long id) {
        transferRepository.deleteById(id);
    }

    @Override
    public List<TransferDto> getAllTransfersOfAUser(Long userId) {
        List<TransferDto> transferDtos = new ArrayList<>();

        Optional<BankAccount> bankAccountOptional = bankAccountRepository.findByUser_Id(userId);
        if (bankAccountOptional.isPresent()) {
            BankAccount bankAccount = bankAccountOptional.get();

            // Find transfers sent by the user
            List<Transfer> transfersSent = transferRepository.findBySender_Id(bankAccount.getId());

            // Find transfers received by the user
            List<Transfer> transfersReceived = transferRepository.findByRecipient_Id(bankAccount.getId());

            // Convert Transfer objects to TransferDto objects
            for (Transfer transfer : transfersSent) {
                transferDtos.add(convertTToTDto(transfer));
            }
            for (Transfer transfer : transfersReceived) {
                transferDtos.add(convertTToTDto(transfer));
            }

            log.info("All Transfers: {}", transferDtos);
        } else {
            log.warn("No bank account found for user with ID: {}", userId);
        }
        return transferDtos;
    }

    @Override
    public List<TransferDto> getAllDepositsOfAUser(Long userId) {
        List<TransferDto> transferDtos = new ArrayList<>();

        Optional<BankAccount> bankAccountOptional = bankAccountRepository.findByUser_Id(userId);
        if (bankAccountOptional.isPresent()) {
            BankAccount bankAccount = bankAccountOptional.get();

            // Find transfers received by the user
            List<Transfer> transfersReceived = transferRepository.findByRecipient_Id(bankAccount.getId());

            // Convert Transfer objects to TransferDto objects
            for (Transfer transfer : transfersReceived) {
                transferDtos.add(convertTToTDto(transfer));
            }

            log.info("All Transfers: {}", transferDtos);
        } else {
            log.warn("No bank account found for user with ID: {}", userId);
        }
        return transferDtos;
    }

@Override
public List<TransferDto> getAllPayoutsOfAUser(Long userId) {
    List<TransferDto> transferDtos = new ArrayList<>();

    Optional<BankAccount> bankAccountOptional = bankAccountRepository.findByUser_Id(userId);
    if (bankAccountOptional.isPresent()) {
        BankAccount bankAccount = bankAccountOptional.get();

        // Find transfers sent by the user
        List<Transfer> transfersSent = transferRepository.findBySender_Id(bankAccount.getId());

        // Convert Transfer objects to TransferDto objects
        for (Transfer transfer : transfersSent) {

            transferDtos.add(convertTToTDto(transfer));
        }

        log.info("All Transfers: {}", transferDtos);
    } else {
        log.warn("No bank account found for user with ID: {}", userId);
    }
    return transferDtos;
}
@Override
public BankAccountDto convertBAToBADto(BankAccount bankAccount){
        log.info("BANKACCOUNT OBJECT BEFORE CONVERTING "+bankAccount);
    //convert bank account to bank account dto for the sender
    BankAccountDto bankAccountDto=new BankAccountDto();
    bankAccountDto.setAccountNumber(bankAccount.getAccountNumber());
    bankAccountDto.setUser(bankAccount.getUser());
    bankAccountDto.setIBAN(bankAccount.getIBAN());
    bankAccountDto.setBankId(bankAccount.getBankId());
    bankAccountDto.setBalance(bankAccount.getBalance());
    return bankAccountDto;
}
    @Override
    public TransferDto convertTToTDto(Transfer transfer){
        log.info("TRANSFER BEFORE CONVERTING"+transfer);
        TransferDto transferDto =new TransferDto();
        transferDto.setId(transfer.getId());
        transferDto.setSender(convertBAToBADto(transfer.getSender()));
        transferDto.setRecipient(convertBAToBADto(transfer.getRecipient()));
        transferDto.setReasonOfTransfer(transfer.getReasonOfTransfer());
        transferDto.setAuthorized(transfer.isAuthorized());
        transferDto.setSum(transfer.getSum());
        transferDto.setDate(transfer.getDate());
        return transferDto;
    }
}


