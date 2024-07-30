import React, { useState, useEffect } from 'react';
import { User } from "../store/types";
import { connect } from 'react-redux';
import { RootState } from '../store/types';
import NewPayout from './NewPayout';
import PayoutsHistory from './PayoutsHistory';
import DepositsHistory from './DepositsHistory';
import TransfersHistory from './TransfersHistory';
import { Transfer, BankAccount } from "../store/types";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from "react-router-dom";
import "./css/ClientProfil.css";
import konto from "../konto.png";
import AccountBalanceChart from './AccountBalanceChart';


const ClientProfil: React.FC = ({}) => {
    const [showDeposits, setShowDeposits] = useState(false);
    const [showPayouts, setShowPayouts] = useState(false);
    const [showTransfers, setShowTransfers] = useState(false);
    const [showNewPayout, setShowNewPayout] = useState(false);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [deposits, setDeposits] = useState<Transfer[]>([]);
    const [payouts, setPayouts] = useState<Transfer[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);
    const [user, setUser] = useState<User | null>(null); // Provide the type for user
    const [greeting, setGreeting] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const account = JSON.parse(Cookies.get('account') || '{}');

    useEffect(() => {
        const loggedIn = Cookies.get('isloggedin') === 'true';
        const userData = JSON.parse(Cookies.get('user') || '{}');

        setIsLoggedIn(loggedIn);
        setUser(userData);

        if (!loggedIn) {
            navigate('/SignIn');
        } else {
            if (userData?.confirmedByAdmin === false) {
                navigate('/unconfirmed');
            } else {
                const fetchBankAccounts = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8088/bankAccounts/user/${userData?.id}`);
                        setBankAccounts(response.data);
                        setSelectedBankAccount(response.data[0]);
                    } catch (error) {
                        console.error('Error fetching bank accounts:', error);
                    }
                };

                fetchBankAccounts();
            }
        }
    }, []);

    useEffect(() => {
        const currentHour = new Date().getHours();
        let greetingMessage = '';

        if (currentHour < 12) {
            greetingMessage = 'Guten Morgen';
        } else if (currentHour < 18) {
            greetingMessage = 'Guten Nachmittag';
        } else {
            greetingMessage = 'Guten Abend';
        }

        setGreeting(greetingMessage);
    }, []);

    useEffect(() => {
        if (selectedBankAccount) {
            const fetchData = async () => {
                try {
                    const bankAccountId = selectedBankAccount.id;

                    const usersTransferResponse = await axios.get(`http://localhost:8088/transfers/bankAccount/transfers/${bankAccountId}`);
                    setTransfers(usersTransferResponse.data);

                    const usersDepositsResponse = await axios.get(`http://localhost:8088/transfers/bankAccount/deposits/${bankAccountId}`);
                    setDeposits(usersDepositsResponse.data);

                    const usersPayoutsResponse = await axios.get(`http://localhost:8088/transfers/bankAccount/payouts/${bankAccountId}`);
                    setPayouts(usersPayoutsResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [selectedBankAccount]);

    const handleBankAccountChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selectedAccount = selectedId !== null
            ? bankAccounts.find(account => account.id === Number(selectedId))
            : undefined;
        setSelectedBankAccount(selectedAccount || null);
    };

    const toggleDeposits = () => {
        setShowDeposits(!showDeposits);
        setShowPayouts(false);
        setShowNewPayout(false);
        setShowTransfers(false);
    };

    const togglePayouts = () => {
        setShowPayouts(!showPayouts);
        setShowDeposits(false);
        setShowNewPayout(false);
        setShowTransfers(false);
    };

    const toggleTransfers = () => {
        setShowTransfers(!showTransfers);
        setShowPayouts(false);
        setShowDeposits(false);
        setShowNewPayout(false);
    };

    const toggleNewPayout = () => {
        setShowNewPayout(!showNewPayout);
        setShowDeposits(false);
        setShowPayouts(false);
        setShowTransfers(false);
    };

    return (
        <div className="client-profile-container text-white">
            <div className="client-profile-card">
                <div className="client-profile-info">
                    <div className="client-profile-info-left">
                        <div className="client-profile-bank-icon">
                            <img src={konto} alt="Bank Icon" />
                        </div>
                        <div className="client-profile-account-details">
                            {account.accountType && (
                                <div className="client-profile-account-type">
                                    <strong>{account.accountType}</strong>
                                </div>
                            )}
                            {account.iban && (
                                <div className="client-profile-iban">
                                    <strong>{account.iban}</strong>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="client-profile-info-center">
                        {user && (
                            <div className="client-profile-owner">
                                <strong>{account.user.firstName + " " + account.user.lastName}</strong>
                            </div>
                        )}
                    </div>
                    <div className="client-profile-info-right">
                        {account.balance !== undefined && (
                            <div className="client-profile-balance">
                                <strong>€{account.balance.toFixed(2)}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AccountBalanceChart iban={account.iban} />
            <div className="client-profile-buttons flex justify-between mx-5 my-5">
                <div className="flex mt-5">
                    <button className="client-profile-btn-red mr-5" onClick={toggleDeposits}>Eingehende Transaktionen</button>
                    <button className="client-profile-btn-red mr-5" onClick={togglePayouts}>Ausgehende Transaktionen</button>
                    <button className="client-profile-btn-red mr-5" onClick={toggleTransfers}>Alle Transaktionen</button>
                    <button className="client-profile-btn-red" onClick={toggleNewPayout}>✚ Überweisung</button>
                </div>
            </div>

            <div className="flex justify-center mx-5 my-5">
                {showDeposits && (
                    <div>
                        <h3>Eingehende Umsätze</h3>
                        <DepositsHistory transfers={deposits} />
                    </div>
                )}
                {showPayouts && (
                    <div>
                        <h3>Ausgehende Umsätze</h3>
                        <PayoutsHistory transfers={payouts} />
                    </div>
                )}
                {showTransfers && (
                    <div>
                        <h3>Alle Umsätze</h3>
                        <TransfersHistory transfers={transfers} userRole={user?.role} />
                    </div>
                )}
                {showNewPayout && (
                    <div>
                        <NewPayout />
                    </div>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    isLoggedIn: state.isLoggedIn,
    user: state.user,
});

export default connect(mapStateToProps)(ClientProfil);
