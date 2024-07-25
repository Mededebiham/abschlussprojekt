import React, { useState, useEffect } from 'react';
import AccountCard from "./components/AccountCard";
import './style.css';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

function AccountsPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        const user = Cookies.get('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            setUserData(parsedUser);
        } else {
            console.error('User data is not available');
        }
    }, []);

    useEffect(() => {
        if (userData) {
            if (userData.confirmedByAdmin === false) {
                navigate('/Unconfirmed');
            } else {
                fetchAccounts(userData.id);
            }
        }
    }, [userData]);

    const fetchAccounts = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:8088/bankAccounts/user/${userId}/accounts`);
            console.log(response.data)
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    return (
        <div className="account-list-container">
            <h1>Konten</h1>
            <div className="underline"></div>
            <div className="account-list">
                {accounts.length > 0 ? (
                    accounts.map((account, index) => (
                        <AccountCard key={index} account={account} />
                    ))
                ) : (
                    <p>No accounts available</p>  // Optional: Show a message if no accounts
                )}
            </div>
        </div>
    );
}

export default AccountsPage;
