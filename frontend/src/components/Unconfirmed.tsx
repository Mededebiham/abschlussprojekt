import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unconfirmed: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any user data and redirect to the sign-in page
        localStorage.clear();
        navigate('/SignIn');
    };

    return (
        <div className="text-white flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-5">Account Unconfirmed</h1>
            <p className="text-lg mb-5">Your account has not been confirmed by an admin yet. Please contact support for further assistance.</p>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default Unconfirmed;
