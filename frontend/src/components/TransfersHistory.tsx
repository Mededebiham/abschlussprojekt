import React, { useState, useEffect } from 'react';
import { Transfer } from '../store/types'; // Import the Transfer interface
import moment from 'moment';
import axios from 'axios'; // Import axios for making HTTP requests

interface DepositsHistoryProps {
    transfers: Transfer[]; // Prop to receive an array of Transfer objects
    userRole: string | undefined;
}

const TransfersHistory: React.FC<DepositsHistoryProps> = ({ transfers, userRole }) => {
    const [showSortByDateAsc, setShowSortByDateAsc] = useState(true);
    const [showSortByDateDes, setShowSortByDateDes] = useState(true);
    const [sortBySumAsc, setSortBySumAsc] = useState(true);
    const [sortedTransfers, setSortedTransfers] = useState([...transfers]); // Create a copy of transfers array for sorting
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [transferToUpdate, setTransferToUpdate] = useState<Transfer | null>(null);
    const [searchQueryTransfer, setSearchQueryTransfer] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const transfersPerPage = 5;

    // Calculate total number of pages
    const totalPages = Math.ceil(transfers.length / transfersPerPage);

    // Get transfers for current page
    const indexOfLastTransfer = currentPage * transfersPerPage;
    const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;

    const filteredTransfers = sortedTransfers.filter(transfer => {
        const recipientInfo = `${transfer.recipient?.user.firstName} ${transfer.recipient?.user.lastName} ${transfer.recipient?.accountNumber} ${transfer.recipient?.iban} ${transfer.recipient?.bankId}`;
        const senderInfo = `${transfer.sender?.user.firstName} ${transfer.sender?.user.lastName} ${transfer.sender?.accountNumber} ${transfer.sender?.iban} ${transfer.sender?.bankId}`;
        const transferInfo = `${recipientInfo} ${senderInfo} ${transfer.reasonOfTransfer}`.toLowerCase();
    
        // Check if any of the transfer information or the sum matches the search query
        return (
            transferInfo.includes(searchQueryTransfer.toLowerCase()) ||
            transfer.sum.toString().includes(searchQueryTransfer.toLowerCase()) ||
            (transfer.date && moment(transfer.date).format('YYYY-MM-DD').includes(searchQueryTransfer.toLowerCase()))
        );
    });
    
    const currentTransfers = filteredTransfers.slice(indexOfFirstTransfer, indexOfLastTransfer);

    // Pagination functions
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };
    const sortByDateAsc = () => {
        const sortedTransfersCopy = [...sortedTransfers]; // Make a copy of the current state
        sortedTransfersCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setSortedTransfers(sortedTransfersCopy); // Update the state with the sorted data
        setShowSortByDateAsc(true);
    };

    const sortByDateDes = () => {
        const sortedTransfersCopy = [...sortedTransfers]; // Make a copy of the current state
        sortedTransfersCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSortedTransfers(sortedTransfersCopy); // Update the state with the sorted data
        setShowSortByDateAsc(false);
    };


    const sortBySum = () => {
        sortedTransfers.sort((a, b) => {
            return sortBySumAsc ? b.sum - a.sum : a.sum - b.sum;
        });
        setSortBySumAsc(!sortBySumAsc);
    };

    const onlyAuthorized = () => {
        const authorizedTransfers = transfers.filter(transfer => transfer.authorized);
        setSortedTransfers(authorizedTransfers);
    };

    const notAuthorized = () => {
        const notAuthorizedTransfers = transfers.filter(transfer => !transfer.authorized);
        setSortedTransfers(notAuthorizedTransfers);
    };

    const handleAuthorizationChange = (transfer: Transfer) => {
        setConfirmationVisible(true);
        setTransferToUpdate(transfer);
    };
    const resetSearch = () => {
        const originalTransfersCopy = [...transfers]; 
        setSortedTransfers(originalTransfersCopy);
    };
    const confirmAuthorizationChange = async (newValue: boolean) => {
        if (transferToUpdate && newValue) {
            try {
                // Update the isAuthorized property of transferToUpdate
                transferToUpdate.authorized = newValue;
                console.log(newValue);
                // Make the axios request to update the transfer
                const response = await axios.put(`http://localhost:8088/transfers/${transferToUpdate.id}`, transferToUpdate);
                console.log(response.data); // Log the response from the server
    
                // Update the transfer in the UI
                const updatedTransfers = sortedTransfers.map(transfer => {
                    if (transfer.id === transferToUpdate.id) {
                        return { ...transfer, authorized: newValue };
                    }
                    return transfer;
                });
                setSortedTransfers(updatedTransfers);
            } catch (error) {
                console.error('Error updating transfer:', error);
            }
        }
        // Reset confirmation state
        setConfirmationVisible(false);
        setTransferToUpdate(null);
    };
  
    
    
    return (
        <div className="h-screen  items-center ml-5">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* Confirmation Pop-up */}
                {confirmationVisible && transferToUpdate && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-4 rounded-md">
                            <p className="text-black">Are you sure you want to change the authorization status of this transfer?</p>
                            <div className="flex justify-end mt-4 cursor-pointer">
                                <button className="bg-green-500 text-white py-1 px-3 mr-2 rounded" onClick={() => confirmAuthorizationChange(true)}>Yes</button>
                                <button className="bg-red-500 text-white py-1 px-3 rounded"  onClick={() => confirmAuthorizationChange(false)}>No</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex mt-5">
                    <div className="my-5">
                        {/* All Users */}
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mb-5" onClick={sortByDateAsc}>Sort By Date Ascending</button>
                        {/* All Transfers*/}
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mt-5" onClick={sortByDateDes}>Sort By Date Descending</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mt-5" onClick={sortBySum}>Sort By Sum</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mt-5" onClick={notAuthorized}>Not authorized</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mt-5" onClick={onlyAuthorized}>Authorized</button>

                    </div>

                </div>

                <input
                        type="text"
                        className='my-4 ml-4 rounded text-black'
                        placeholder="Search transfers..."
                        value={searchQueryTransfer}
                        onChange={(e) => setSearchQueryTransfer(e.target.value)}
                    />
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-4 mt-5" onClick={resetSearch}>Reset</button>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Recipient
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Sender
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Reason of Transfer
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                Sum
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Authorized
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentTransfers.map((transfer, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                    {transfer.recipient?.user.firstName} {transfer.recipient?.user.lastName}
                                </th>
                                <td className="px-6 py-4">
                                    {transfer.sender?.user.firstName} {transfer.sender?.user.lastName}
                                </td>
                                <td className="px-6 py-4  bg-gray-50 dark:bg-gray-800">
                                    {moment(transfer.date).format('MMMM Do YYYY')} {/* Example date format */}
                                </td>
                                <td className="px-6 py-4 ">
                                    {transfer.reasonOfTransfer}
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                    {transfer.sum}
                                </th>
                                <td className="px-6 py-4">
                                    {transfer.authorized ? (
                                        <span className="text-green-500 cursor-auto">&#10004;</span>
                                    ) : (
                                            <span className={`text-red-500 ${userRole === 'admin' ? 'cursor-pointer' : ''}`}  onClick={userRole === 'admin' ? () => handleAuthorizationChange(transfer) : undefined}>&#10008;</span>
                                        )}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                <button onClick={prevPage} disabled={currentPage === 1} className="mt-2 rounded bg-gray-500 text-white py-1 px-3">Previous</button>
                <span>{currentPage}/{totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="mt-2 rounded bg-gray-500 text-white py-1 px-3">Next</button>
            </div>
        </div>
    );
}

export default TransfersHistory;
