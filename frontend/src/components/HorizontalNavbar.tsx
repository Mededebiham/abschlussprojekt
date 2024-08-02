import React from 'react';
import { connect } from 'react-redux';
import { useUser } from '../store/UserContext';
import './css/HorizontalNavbar.css';

interface HorizontalNavbarProps {
    logout: () => void; // Pass the logout function as a prop
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ logout }) => {
    const { user } = useUser();

    const handleLogout = () => {
        console.log('Logout button clicked');
        logout();
    };

    return (
        <nav className="bg-red-600 h-16 py-3 px-4 flex justify-between items-center shadow-lg">
            <div className="flex items-center">
                <img src="/img.png" alt="Piggy Bank Icon" className="w-16 h-16 mr-4" />
            </div>
            <ul className="flex list-none m-0 p-0 space-x-10 text-white">
                {user && <li className="hidden sm:block">Willkommen {user.firstName}!</li>}
                <li><a href="/" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">⛫ Home</a></li>
                <li><a href="/About" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">⛾ Über uns</a></li>
                <li><a href="/Produkt" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">⛃ Unsere Produkte</a></li>
                {user ? (
                    <>
                        {user.role === "user" ? (
                            <>
                                <li><a href="/accounts" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">€ Konten</a></li>
                                {/*<li className="mx-10 text-white"><a href="/ClientProfil">Profile</a></li>*/}
                            </>
                        ) : (
                            <li><a href="/AdminProfil" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">Profil</a></li>
                        )}
                        <li onClick={handleLogout}><a href="#" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">Abmelden</a></li>
                    </>
                ) : (
                    <>
                        <li><a href="/Register" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">Registrieren</a></li>
                        <li><a href="/SignIn" className="px-3 py-2 hover:bg-gray-200 hover:text-red-600 rounded-full transition">Anmelden</a></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default connect(null, null)(HorizontalNavbar);
