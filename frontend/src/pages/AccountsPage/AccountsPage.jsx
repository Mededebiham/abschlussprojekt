import React from 'react';
import AccountCard from "./components/AccountCard";
import './style.css'

export const accounts = [
    {
        id: 1,
        type: 'Girokonto',
        number: 'DE89123456789012345678',
        balance: 1500.00,
        lastTransaction: '01.07.2024 - Gehaltseingang',
        income: 3000.00,
        expense: 1500.00,
        interestRate: null,
        ownerName: "Yasin Ekinci"
    },
    {
        id: 2,
        type: 'Sparkonto',
        number: 'DE89123456789012345678',
        balance: 5000.00,
        lastTransaction: '01.07.2024 - Zinsen',
        income: 200.00,
        expense: 0.00,
        interestRate: '1,5%',
        ownerName: "Yasin Ekinci"

    },
];

function AccountsPage() {
    return (

            <div className="account-list-container">
                <h1>Konten</h1>
                <div className="underline"></div>
                <div className="account-list">
                    {accounts.map((account, index) => (
                        <AccountCard key={index} account={account}/>
                    ))}
                </div>
            </div>

    );
};
export default AccountsPage;