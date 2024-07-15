package com.till.bank.service;

import com.till.bank.dto.BankAccountDto;
import com.till.bank.dto.TransferDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;

import java.util.List;

public interface TransferService {

    List<TransferDto> getAllTransfers();

    Transfer getTransferById(Long id);

    Transfer createTransfer(TransferDto transferDto);

    Transfer updateTransfer(Long id, TransferDto transferDto);

    void deleteTransfer(Long id);

    List<TransferDto> getAllTransfersOfAUser(Long id);
    List<TransferDto> getAllDepositsOfAUser(Long id);

    List<TransferDto> getAllPayoutsOfAUser(Long id);
    BankAccountDto convertBAToBADto(BankAccount bankAccount);
    TransferDto convertTToTDto(Transfer transfer);

}
