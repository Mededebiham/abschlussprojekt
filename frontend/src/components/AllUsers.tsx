import React, { useState } from 'react';
import axios from 'axios';
import { UserTable } from '../store/types'; // Import the user interface
import UserModal from "./UserModal"

interface AllUsersProps {
    users: UserTable[]; // Prop to receive an array of user objects
}

const AllUsers: React.FC<AllUsersProps> = ({ users }) => {
    const [searchQueryUser, setSearchQueryUser] = useState('');
    const [choosenUser, setChoosenUser] = useState<UserTable | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showUnconfirmedOnly, setShowUnconfirmedOnly] = useState(false);
    const usersPerPage = 5;

    const filteredUsers = users.filter((user) =>
        `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(searchQueryUser.toLowerCase()) &&
        (!showUnconfirmedOnly || !user.confirmedByAdmin)
    );

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const handleUserClick = async (selectedUser: UserTable) => {
        if (!selectedUser.confirmedByAdmin) {
            const confirmActivation = window.confirm('Wollen sie diesen Benutzer aktivieren?');
            if (confirmActivation) {
                const updatedUser = { ...selectedUser, confirmedByAdmin: true };
                try {
                    await axios.put(`http://localhost:8088/users/activate/${selectedUser.id}`);
                    setChoosenUser(updatedUser);
                    // Update the user list with the new confirmed status
                    const updatedUserList = userList.map(user =>
                        user.id === selectedUser.id ? { ...user, confirmedByAdmin: true } : user
                    );
                    setUserList(updatedUserList);
                    setCurrentPage(1); // Reset to first page to reflect the changes immediately
                } catch (error) {
                    console.error('Error activating user:', error);
                }
            }
        } else {
            setChoosenUser(selectedUser);
        }
    };

    const nextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    return (
        <div className="h-screen items-center ml-5 mt-9">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <h3>Alle Kunden:</h3>
                <input
                    type="text"
                    placeholder="Suche nach Kunden..."
                    value={searchQueryUser}
                    onChange={(e) => setSearchQueryUser(e.target.value)}
                    className="my-4 rounded text-black"
                />
                <button
                    onClick={() => setShowUnconfirmedOnly((prev) => !prev)}
                    className="mb-4 rounded bg-blue-500 text-white py-2 px-4 ml-4"
                >
                    {showUnconfirmedOnly ? 'Alle Benutzer' : 'Unbestätigte Kunden'}
                </button>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 mt-9">
                    <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Vorname</th>
                        <th scope="col" className="px-6 py-3 text-white">Nachname</th>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">E-Mail</th>
                        <th scope="col" className="px-6 py-3 text-white">Adresse</th>
                        <th scope="col" className="px-6 py-3 bg-gray-50 dark:bg-gray-800">Aktiviert</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentUsers.map((user, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                            onClick={() => handleUserClick(user)}>
                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                {user.firstName}
                            </th>
                            <td className="px-6 py-4">{user.lastName}</td>
                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">{user.email}</td>
                            <td className="px-6 py-4">
                                {user.address.street}, {user.address.streetNumber}, {user.address.city}, {user.address.zipCode}, {user.address.country}
                            </td>
                            <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                                {user.confirmedByAdmin ? (
                                    <span className="text-green-500">&#10004;</span> // Green checkmark
                                ) : (
                                    <span className="text-red-500">&#10008;</span> // Red cross
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center mt-4">
                <button onClick={prevPage} disabled={currentPage === 1}
                        className="mt-2 rounded bg-gray-500 text-white py-1 px-3">Zurück
                </button>
                <span className="mx-4">{currentPage}/{totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="mt-2 rounded bg-gray-500 text-white py-1 px-3">Weiter</button>
            </div>
            {choosenUser && <UserModal isOpen={true} onClose={() => setChoosenUser(null)} user={choosenUser} />}
        </div>
    );
}

export default AllUsers;
