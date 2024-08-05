import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserTable, BankAccount } from '../store/types';
import './css/UserModalStyle.css';  // Import the CSS file

interface UserModalProps {
    user: UserTable;
    onClose: () => void;
    isOpen: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, isOpen }) => {
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

    useEffect(() => {
        if (isOpen) {
            const fetchBankAccounts = async () => {
                try {
                    const response = await axios.get(`http://localhost:8088/bankAccounts/user/${user?.id}`);
                    setBankAccounts(response.data);
                    console.log(response.data)
                } catch (error) {
                    console.error('Error fetching bank accounts:', error);
                }
            };

            fetchBankAccounts();
        }
    }, [user.id, isOpen]);

    const handleActivate = async (accountId: number) => {
        const accountToActivate = bankAccounts.find(account => Number(account.id) === accountId);

        if (!accountToActivate) {
            console.error('Account not found:', accountId);
            return;
        }

        try {
            await axios.put(`http://localhost:8088/bankAccounts/activate/${accountId}`);
            setBankAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    Number(account.id) === accountId ? { ...account, confirmedByAdmin: true } : account
                )
            );
        } catch (error) {
            console.error('Error activating bank account:', error);
        }
    };

    const handleCancel = async (accountId: number) => {
        const accountToCancel = bankAccounts.find(account => Number(account.id) === accountId);

        if (!accountToCancel) {
            console.error('Account not found:', accountId);
            return;
        }

        try {
            await axios.put(`http://localhost:8088/bankAccounts/cancel/${accountId}`);
            setBankAccounts((prevAccounts) =>
                prevAccounts.map((account) =>
                    Number(account.id) === accountId ? { ...account, confirmedByAdmin: false } : account
                )
            );
        } catch (error) {
            console.error('Error canceling bank account:', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    const handleModalClick = (e: React.MouseEvent) => {
        // Prevent modal content click from closing the modal
        e.stopPropagation();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={handleModalClick}>
                <h2><strong>Benutzer Details:</strong></h2>
                <p><strong>Vorname:</strong> {user.firstName}</p>
                <p><strong>Nachname:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Addresse:</strong> {user.address.street}, {user.address.streetNumber}, {user.address.city}, {user.address.zipCode}, {user.address.country}</p>

                <h3><strong>Bankkonten:</strong>:</h3>
                {bankAccounts.map(account => (
                    <div key={account.id} className="account-details">
                        <p><strong>Kontonummer:</strong> {account.accountNumber}</p>
                        <p><strong>Kontotyp:</strong> {account.accountType}</p>
                        <p><strong>Kontostand:</strong> {account.balance}</p>
                        <p><strong>IBAN:</strong> {account.iban}</p>
                        <p><strong>Vom Admin autorisiert:</strong> {account.confirmedByAdmin ? 'Yes' : 'No'}</p>
                        {!account.confirmedByAdmin ? (
                            <button onClick={() => handleActivate(Number(account.id))} className="activate-button">
                                Aktivieren
                            </button>
                        ) : (
                            <button onClick={() => handleCancel(Number(account.id))} className="cancel-button">
                                Konto deaktivieren
                            </button>
                        )}
                    </div>
                ))}

                <button onClick={onClose} className="close-button">Schliessen</button>
            </div>
        </div>
    );
};

export default UserModal;
