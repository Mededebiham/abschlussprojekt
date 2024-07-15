import React, { useState, useEffect } from 'react';
import TransfersHistory from './TransfersHistory';
import { Transfer } from '../store/types'; // Import the Transfer interface
import axios from 'axios';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        address: {
            street: string;
            streetNumber: string;
            city: string;
            zipCode: string;
            country: string;
        };
    } | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, user }) => {
    const [searchQueryTransfer, setSearchQueryTransfer] = useState('');
    const [transfers, setTransfers] = useState<Transfer[]>([]);

    const filteredTransfers = transfers.filter((transfer) =>
        `${transfer.recipient} ${transfer.sender} ${transfer.reasonOfTransfer}`.toLowerCase().includes(searchQueryTransfer.toLowerCase())
    );

    useEffect(() => {
        // Fetch all users and payouts from the backend
        const fetchData = async () => {
            try {
                const transfersResponse = await axios.get('/api/payouts'); //get all transfers from user.id

                setTransfers(transfersResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Empty dependency array to fetch data only once when the component mounts

    if (!isOpen || !user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50">
            {/* Popup container */}
            <div className="relative w-auto max-w-md mx-auto my-6">
                {/* Modal content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden relative flex flex-col w-full">
                    {/* Close button */}
                    <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>&times;</span>
                    {/* Modal header */}
                    <div className="p-5 border-b border-solid border-blueGray-200">
                        <h2 className="text-lg font-semibold">User Details</h2>
                    </div>
                    {/* Modal body */}
                    <div className="p-5">
                        <p><strong>First Name:</strong> {user.firstName}</p>
                        <p><strong>Last Name:</strong> {user.lastName}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Address:</strong> {user.address.street} {user.address.streetNumber}, {user.address.city}, {user.address.zipCode}, {user.address.country}</p>
                    </div>
                    <div className="p-5 border-b border-solid border-blueGray-200">
                        <h2 className="text-lg font-semibold">All User Transfers:</h2>
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Search transfers..."
                            value={searchQueryTransfer}
                            onChange={(e) => setSearchQueryTransfer(e.target.value)}
                        />

                    </div>
                    <TransfersHistory transfers={filteredTransfers} userRole="admin"/>
                    {/* button to show only payouts and only deposits */}

                    {/* Modal footer */}
                    <div className="p-5 border-t border-solid border-blueGray-200 flex justify-end">
                        <button className="p-2 m-2 text-gray-600" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserModal;
