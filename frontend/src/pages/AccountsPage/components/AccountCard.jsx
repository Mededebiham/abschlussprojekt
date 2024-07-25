// AccountCard.js
import React from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AccountCard = ({ account }) => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        const accountString = JSON.stringify(account);

        Cookies.set('account', accountString, { expires: 7 });


        navigate("/ClientProfil");
    };
    return (
        <div className="account-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
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
