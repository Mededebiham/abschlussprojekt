package com.till.bank.service;

import com.till.bank.dto.BalanceChartEntryDto;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.Transfer;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.TransferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class BalanceChartService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private TransferRepository transferRepository;

    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    public List<BalanceChartEntryDto> getBalanceHistory(String iban) {
        BankAccount account = bankAccountRepository.findByIBAN(iban);
        if (account == null) {
            throw new RuntimeException("Bank account not found for IBAN: " + iban);
        }

        List<Transfer> transfers = transferRepository.findByRecipientIdOrSenderId(account.getId(), account.getId());

        // Transferleri tarihe göre sırala
        transfers.sort(Comparator.comparing(Transfer::getDate));

        List<BalanceChartEntryDto> balanceEntries = new ArrayList<>();

        double currentBalance = account.getBalance();
        for (Transfer transfer : transfers) {
            if (transfer.getRecipient().getId().equals(account.getId())) {
                currentBalance += transfer.getSum();
            } else if (transfer.getSender().getId().equals(account.getId())) {
                currentBalance -= transfer.getSum();
            }
            balanceEntries.add(new BalanceChartEntryDto(sdf.format(transfer.getDate()), currentBalance));
        }

        return balanceEntries;
    }
}
