import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, UserTable, Transfer, RegistRequest } from '../store/types';
import AllUsers from './AllUsers';
import TransfersHistory from './TransfersHistory';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Pagination from './Pagination';
import RegistRequests from "./RegistRequests"; // Import a Pagination component or create one

const AdminProfil: React.FC = () => {
    const [showSearchForUsers, setShowSearchForUsers] = useState(false);
    const [showTransfers, setShowTransfers] = useState(false);
    const [showRegistRequests, setShowRegistRequests] = useState(false);
    const [users, setUsers] = useState<UserTable[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [registrequests, setRegistrequests] = useState<RegistRequest[]>([]);
    const [searchQueryTransfer, setSearchQueryTransfer] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // You can adjust items per page
    const navigate = useNavigate();

    useEffect(() => {
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
                    const registRequestResponse = await axios.get('http://localhost:8088/registrequests');
                    setUsers(usersResponse.data);
                    setTransfers(transfersResponse.data);
                    setRegistrequests(registRequestResponse.data);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [navigate]);

    const toggleSearchForUsers = () => {
        setShowSearchForUsers(!showSearchForUsers);
        setShowTransfers(false);
        setShowRegistRequests(false);
    };

    const toggleTransfers = () => {
        setShowTransfers(!showTransfers);
        setShowSearchForUsers(false);
        setShowRegistRequests(false);
    };

    const toggleRegistRequests = () => {
        setShowRegistRequests(!showRegistRequests);
        setShowSearchForUsers(false);
        setShowTransfers(false);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const paginate = (items: any[]) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    };

    return (
        <div className="text-white">
            <div className="flex justify-center mt-5">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-5 my-5"
                        onClick={toggleSearchForUsers}>Alle Benutzer
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-5 my-5"
                        onClick={toggleTransfers}>Alle Transaktionen anzeigen
                </button>
            </div>
            {showSearchForUsers &&
                <>
                    <AllUsers users={paginate(users)} />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={users.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            }
            {showTransfers &&
                <>
                    <TransfersHistory transfers={paginate(transfers)} userRole={user?.role} />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={transfers.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            }
            {showRegistRequests &&
                <>
                    <RegistRequests requests={paginate(registrequests)} />
                    <Pagination
                        itemsPerPage={itemsPerPage}
                        totalItems={registrequests.length}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            }
        </div>
    );
};

export default AdminProfil;
