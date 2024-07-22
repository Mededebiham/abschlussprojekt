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
import {useLocation, useNavigate} from "react-router-dom";

const ClientProfil: React.FC = ({ }) => {
    // State variables to manage component visibility
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
    const { accountType, balance } = location.state || {};

    useEffect(() => {
        // Retrieve parameters from cookies
        const loggedIn = Cookies.get('isloggedin') === 'true';
        const userData = JSON.parse(Cookies.get('user') || '{}');

        setIsLoggedIn(loggedIn);
        setUser(userData);

        if (!loggedIn) {
            navigate('/SignIn');
        } else {
            if (userData?.confirmedByAdmin === false) {
                navigate('/unconfirmed'); // Redirect to an unconfirmed user page
            } else {
                const fetchBankAccounts = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8088/bankAccounts/user/${userData?.id}`);
                        setBankAccounts(response.data);
                        setSelectedBankAccount(response.data[0]); // Set the first bank account as default
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
            console.log("bank account selected")
            console.log(selectedBankAccount);
            const fetchData = async () => {
                try {
                    const bankAccountId = selectedBankAccount.id;

                    // Get all transfers for the selected bank account
                    const usersTransferResponse = await axios.get(`http://localhost:8088/transfers/bankAccount/transfers/${bankAccountId}`);
                    setTransfers(usersTransferResponse.data);

                    // Get all deposits for the selected bank account
                    const usersDepositsResponse = await axios.get(`http://localhost:8088/transfers/bankAccount/deposits/${bankAccountId}`);
                    setDeposits(usersDepositsResponse.data);

                    // Get all payouts for the selected bank account
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
        const selectedAccount = bankAccounts.find(account => account.id === selectedId);
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
        <div className="text-white">
            <div className="ml-5">
                {accountType && (
                    <div className="text-black">
                        <strong>Kontotyp: </strong>{accountType}
                    </div>
                )}
                {balance !== undefined && (
                    <div className="text-black">
                        <strong>{greeting}, Ihr Gesamtsaldo ist: </strong>€{balance.toFixed(2)}
                    </div>
                )}
            </div>
            <div className="flex justify-between mx-5 my-5">
                <div className="flex mt-5">
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5"
                            onClick={toggleDeposits}>Eingehende Transaktionen
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5"
                            onClick={togglePayouts}>Ausgehende Transaktionen
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5"
                            onClick={toggleTransfers}>Alle Transaktionen
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={toggleNewPayout}>✚ Überweisung
                    </button>
                </div>
            </div>

            <div className="flex justify-center mx-5 my-5">
                {showDeposits && (
                    <div>
                        <h3>Eingehende Umsätze</h3>
                        <DepositsHistory transfers={deposits}/>
                    </div>
                )}
                {showPayouts && (
                    <div>
                        <h3>Ausgehende Umsätze</h3>
                        <PayoutsHistory transfers={payouts}/>
                    </div>
                )}
                {showTransfers && (
                    <div>
                        <h3>Alle Umsätze</h3>
                        <TransfersHistory transfers={transfers} userRole={user?.role}/>
                    </div>
                )}
                {showNewPayout && (
                    <div>
                        <h3>Überweisung</h3>
                        <NewPayout/>
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
