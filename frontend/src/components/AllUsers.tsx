import React, { useState, useEffect } from 'react';
import { UserTable } from '../store/types'; // Import the user interface
import UserModal from "./UserModal"

interface AllUsersProps {
    users: UserTable[]; // Prop to receive an array of user objects
}
const AllUsers: React.FC<AllUsersProps> = ({ users }) => {
    const [searchQueryUser, setSearchQueryUser] = useState('');
    const [choosenUser, setChoosenUser] = useState<UserTable | null>(null);

    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQueryUser.toLowerCase())
    );
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 5;
     // Calculate total number of pages
     const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

     // Get users for current page
     const indexOfLastUser = currentPage * usersPerPage;
     const indexOfFirstUser = indexOfLastUser - usersPerPage;
     const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handleUserClick = (selectedUser: UserTable) => {
        // Handle user click, e.g., show modal with detailed user information
        setChoosenUser(selectedUser);
        console.log('Selected user:', selectedUser);
    };
    // Function to go to next page
    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    // Function to go to previous page
    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };


    return (
        <div className="h-screen  items-center ml-5">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">


                <h3>All Users:</h3>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQueryUser}
                    onChange={(e) => setSearchQueryUser(e.target.value)}
                    className='my-4 rounded text-black'
                />
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                First name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Last name
                            </th>
                            <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
                                email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Adress
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={index} className="border-b border-gray-200 dark:border-gray-700" onClick={() => handleUserClick(user)}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                    {user.firstName}
                                </th>
                                <td className="px-6 py-4">
                                    {user.lastName}
                                </td>

                                <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                                    {user.email}
                                </td>
                                <th scope="row" className="px-6 py-4 ">
                                    {user.address.street},{user.address.streetNumber}, {user.address.city}, {user.address.zipCode}, {user.address.country}
                                </th>


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
            {(choosenUser !== null) && <UserModal isOpen={true} onClose={() => setChoosenUser(null)} user={choosenUser} />}

        </div>
    );
}

export default AllUsers;