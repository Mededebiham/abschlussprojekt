// AccountCard.js
import React from 'react';
import './style.css';

const AccountCard = ({ account }) => {
    return (
        <div className="account-card">
            <div className="account-info">
                <div className="account-detail">
                    <strong>Kontotyp:</strong>
                    <p>
                        {account.type}

                    </p>
                </div>
                <div className="account-detail">
                    <strong>IBAN:</strong> {account.number}
                </div>
                <div className="account-detail">
                    <strong>Kontoinhaber:</strong> {account.ownerName}
                </div>
                <div className="account-balance">
                    <strong>Kontostand: </strong> <p>€{account.balance.toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;
