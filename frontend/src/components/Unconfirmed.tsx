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
        <div className="text-blackflex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-5">Account Unconfirmed</h1>
            <p className="text-lg mb-5">Ihr Konto wurde noch nicht bestätigt. Bitte haben sie ein wenig Geduld oder wenden sie sich an den Kundenservice.</p>
            <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
            >
                Abmelden
            </button>
        </div>
    );
};

export default Unconfirmed;
