import React, { useState } from 'react';
import { RegistRequest } from '../store/types'; // Import the RegistRequest interface
import axios from 'axios'; // Import axios for making HTTP requests

interface RegistRequestsProps {
    requests: RegistRequest[]; // Prop to receive an array of RegistRequest objects
}

const RegistRequests: React.FC<RegistRequestsProps> = ({ requests }) => {
    const [showSortByDateAsc, setShowSortByDateAsc] = useState(true);
    const [sortedRequests, setSortedRequests] = useState([...requests]); // Create a copy of requests array for sorting
    const [searchQueryRequest, setSearchQueryRequest] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const requestsPerPage = 5;

    // Calculate total number of pages
    const totalPages = Math.ceil(requests.length / requestsPerPage);

    // Get requests for current page
    const indexOfLastRequest = currentPage * requestsPerPage;
    const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;

    const filteredRequests = sortedRequests.filter(request => {
        const requestInfo = `${request.user.firstName} ${request.user.lastName} ${request.user.bankAccount.iban}`.toLowerCase();
        return requestInfo.includes(searchQueryRequest.toLowerCase());
    });

    const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);

    // Pagination functions
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const sortByDateAsc = () => {
        const sortedRequestsCopy = [...sortedRequests]; // Make a copy of the current state
        sortedRequestsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setSortedRequests(sortedRequestsCopy); // Update the state with the sorted data
        setShowSortByDateAsc(true);
    };

    const sortByDateDes = () => {
        const sortedRequestsCopy = [...sortedRequests]; // Make a copy of the current state
        sortedRequestsCopy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSortedRequests(sortedRequestsCopy); // Update the state with the sorted data
        setShowSortByDateAsc(false);
    };

    const resetSearch = () => {
        const originalRequestsCopy = [...requests];
        setSortedRequests(originalRequestsCopy);
    };
    const handleRowClick = async (request: RegistRequest) => {
        const isConfirmed = window.confirm('Do you want to confirm the user?');

        if (isConfirmed) {
            try {
                const updatedRequest = {
                    ...request,
                    isApproved: true,
                    user: {
                        ...request.user,
                        confirmedByAdmin: true,
                    },
                };

                const response = await fetch(`http://localhost:8082/registrequests/${request.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedRequest),
                });

                if (response.ok) {
                    console.log('Request updated successfully');
                    // Optionally, you can update the state to reflect the changes in the UI
                } else {
                    console.error('Failed to update request');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };



    return (
        <div className="h-screen items-center ml-5">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <div className="flex mt-5">
                    <div className="my-5">
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mb-5" onClick={sortByDateAsc}>Datum (aufsteigend)</button>
                        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mx-2 mt-5" onClick={sortByDateDes}>Datum (absteigend)</button>
                    </div>
                </div>

                <input
                    type="text"
                    className='my-4 ml-4 rounded text-black'
                    placeholder="Anfragen durchsuchen"
                    value={searchQueryRequest}
                    onChange={(e) => setSearchQueryRequest(e.target.value)}
                />
                <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mx-4 mt-5" onClick={resetSearch}>Zurücksetzen</button>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                            Benutzername
                        </th>
                        <th scope="col" className="px-6 py-3">
                            IBAN
                        </th>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                            Datum
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentRequests.map((request, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700" onClick={() => handleRowClick(request)}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                {request.user.firstName} {request.user.lastName}
                            </th>
                            <td className="px-6 py-4">
                                {request.user.bankAccount.iban}
                            </td>
                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                                {new Date(request.date).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center">
                <button onClick={prevPage} disabled={currentPage === 1} className="mt-2 rounded bg-gray-500 text-white py-1 px-3">❮ Zurück</button>
                <span>{currentPage}/{totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="mt-2 rounded bg-gray-500 text-white py-1 px-3">Weiter ❯</button>
            </div>
        </div>
    );
}

export default RegistRequests;
