import React, { useState, useEffect } from 'react';
import { User } from "../store/types";
import { connect } from 'react-redux';
import { RootState } from '../store/types';
import NewPayout from './NewPayout';
import PayoutsHistory from './PayoutsHistory';
import DepositsHistory from './DepositsHistory';
import TransfersHistory from './TransfersHistory';
import { Transfer } from "../store/types"
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { BankAccount } from '../store/types';


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
    const [bankAccount, setBankAccount] = useState<BankAccount>();
    const [user, setUser] = useState<User | null>(null); // Provide the type for user
    const navigate = useNavigate();

    useEffect(() => {
        // Retrieve parameters from cookies
        const loggedIn = Cookies.get('isloggedin') === 'true';
        const userData = JSON.parse(Cookies.get('user') || '{}');

        setIsLoggedIn(loggedIn);
        setUser(userData);

        if (!loggedIn) {
            navigate('/SignIn');
        } else {
            const fetchData = async () => {
                //get all of the transfers
                try {
                    const usersTransferResponse = await axios.get('http://localhost:8088/transfers/user/transfers/' + userData?.id);
                    setTransfers(usersTransferResponse.data);
                    console.log(userData?.id);
                    console.log(usersTransferResponse);


                    //Get all of the deposits 
                    const usersDepositsResponse = await axios.get('http://localhost:8088/transfers/user/deposits/' + userData?.id);
                    setDeposits(usersDepositsResponse.data);

                    //Get all of the payouts
                    const usersPayoutsResponse = await axios.get('http://localhost:8088/transfers/user/payouts/' + userData?.id);
                    setPayouts(usersPayoutsResponse.data);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
            getBankAccountOfUser(userData?.id)
                .then((bankAccount) => {
                    console.log(bankAccount);
                    setBankAccount(bankAccount);
                })
                .catch((error) => {
                    console.error('Error fetching bank account:', error);
                });
        }
    }, []);


    // Function to toggle deposits section visibility
    const toggleDeposits = () => {
        setShowDeposits(!showDeposits);
        setShowPayouts(false); // Close payouts section if open
        setShowNewPayout(false);
        setShowTransfers(false);

    };

    // Function to toggle payouts section visibility
    const togglePayouts = () => {
        setShowPayouts(!showPayouts);
        setShowDeposits(false); // Close deposits section if open
        setShowNewPayout(false);
        setShowTransfers(false);

    };
    const toggleTransfers = () => {
        setShowTransfers(!showTransfers);
        setShowPayouts(false);
        setShowDeposits(false); // Close deposits section if open
        setShowNewPayout(false);

    };
    const toggleNewPayout = () => {
        setShowNewPayout(!showNewPayout);
        setShowDeposits(false); // Close deposits section if open
        setShowPayouts(false); // Close payouts section if open
        setShowTransfers(false);

    };

    const getBankAccountOfUser = async (userId: string | null) => {
        if (userId !== null) {
            try {
                const response = await axios.get(`http://localhost:8088/bankAccount/user/${userId}`);
                console.log(response.data);
                return response.data;
            } catch (error) {
                console.error('Authentication failed:', error);
            }
        } else {
            return null;
        }
    }



    return (
        <div className="text-white">
            <h2 className=" text-white font-bold my-5 ml-5" >Welcome, {user?.username}!</h2>
            <div className="flex justify-between mx-5 my-5">
                <div className="flex mt-5">
                    {/* Button to toggle deposits section visibility */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5" onClick={toggleDeposits}>Show Deposits</button>
                    {/* Button to toggle payouts section visibility */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5" onClick={togglePayouts}>Show Payouts</button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5" onClick={toggleTransfers}>Show All Transfers</button>

                    {/* New Payout Section */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={toggleNewPayout}>New Payout</button>
                </div>
            </div>
            <div className="ml-5"> Your Account balance is as follows: {bankAccount?.balance}</div>
            {/* Deposits Section */}
            <div className="flex justify-center mx-5 my-5">
                {showDeposits && (
                    <div>
                        <h3>Deposits History</h3>
                        <DepositsHistory transfers={deposits} />
                    </div>
                )}
                {/* Payouts Section */}
                {showPayouts && (
                    <div>
                        <h3>Payouts History</h3>
                        <PayoutsHistory transfers={payouts} />
                    </div>
                )}
                {showTransfers && (
                    <div>
                        <h3>Transfers History</h3>
                        <TransfersHistory transfers={transfers} userRole={user?.role} />
                    </div>
                )}
                {showNewPayout && (
                    <div>
                        <h3>New Payout</h3>
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
