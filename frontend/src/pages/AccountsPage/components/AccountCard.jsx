// AccountCard.js
import React from 'react';
import './style.css';

const AccountCard = ({ account }) => {
    return (
        <div className="account-card">
            <div className="account-info">
                <div className="account-detail">
                    <strong>Kontotyp: </strong>
                      <span>
                       {account.accountType}
                      </span>

                </div>
                <div className="account-detail">
                    <strong>IBAN:</strong> {account.iban}
                </div>
                <div className="account-detail">
                    <strong>Kontoinhaber: </strong>
                    <span>
                        {account.user.firstName + " " + account.user.lastName}
                    </span>
                </div>
                <div className="account-balance">
                    <strong>Kontostand: </strong> <span>€{account.balance.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default AccountCard;
