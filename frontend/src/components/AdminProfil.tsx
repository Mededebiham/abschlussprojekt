import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/types';
import axios from 'axios';
import { User } from "../store/types";
import { UserTable } from "../store/types"
import { Transfer } from "../store/types"
import AllUsers from './AllUsers';
import TransfersHistory from './TransfersHistory';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';




const AdminProfil: React.FC = ({ }) => {
    // State variables to manage component visibility
    const [showSearchForUsers, setShowSearchForUsers] = useState(false);
    const [showTransfers, setShowTransfers] = useState(false);
    const [users, setUsers] = useState<UserTable[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [searchQueryTransfer, setSearchQueryTransfer] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null); // Provide the type for user
    const navigate = useNavigate();

  
    useEffect(() => {
        // Retrieve parameters from cookies
        const loggedIn = Cookies.get('isloggedin') === 'true';
        const userData = JSON.parse(Cookies.get('user') || '{}');

        setIsLoggedIn(loggedIn);
        setUser(userData);

        if (!loggedIn || (userData !== null && userData.role !== 'admin')) {
            navigate('/SignIn');
        } else {
            const fetchData = async () => {
                try {
                    const usersResponse = await axios.get('http://localhost:8088/users');
                const transfersResponse = await axios.get('http://localhost:8088/transfers');

                setUsers(usersResponse.data);
                setTransfers(transfersResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, []);


    // Function to toggle deposits section visibility
    const toggleSearchForUsers = () => {
        setShowSearchForUsers(!showSearchForUsers);
        setShowTransfers(false); // Close payouts section if open
    };

    // Function to toggle payouts section visibility
    const togglePayouts = () => {
        setShowTransfers(!showTransfers);
        setShowSearchForUsers(false); // Close deposits section if open
    };

    return (

        <div className="text-white">
            <div className="flex justify-between mx-5 my-5">
                <div className="flex mt-5">
                    {/* All Users */}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5" onClick={toggleSearchForUsers}>All Users</button>
                    {/* All Transfers*/}
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5" onClick={togglePayouts}>Show Transfers</button>


                </div>
            </div>
            {/* Users Table */}
            {showSearchForUsers &&
                <AllUsers users={users} />
            }
            {showTransfers &&
                <> <div>
                    {/* <input
                        type="text"
                        className='my-4 ml-4 rounded text-black'
                        placeholder="Search transfers..."
                        value={searchQueryTransfer}
                        onChange={(e) => setSearchQueryTransfer(e.target.value)}
                    /> */}

                </div>
                    <TransfersHistory transfers={transfers} userRole={user?.role}/>
                </>
            }

        </div>
    );
};



export default AdminProfil;
