import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/types';
import { User } from "../store/types";
import './css/HorizontalNavbar.css';
import Cookies from 'js-cookie';
import { useUser } from '../store/UserContext';

interface HorizontalNavbarProps {

    logout: () => void; // Pass the logout function as a prop
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ logout }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    // const [user, setUser] = useState<User | null>(null);

    const { user, setUser } = useUser();



    const handleLogout = () => {
        console.log('Logout button clicked');
        logout();
    };

    return (
        <nav className="bg-red-600 h-33 py-3 flex justify-between">
            <div className="flex items-center">
                <img src="/piggy-bank.png" alt="Piggy Bank Icon" className="w-10 h-10 mr-4 ml-1" />
            </div>
            <ul className="flex list-none m-0 p-0">
                {user !== null && <li className="mx-10 text-white">Willkommen {user?.firstName}!</li>}
                <li className="mr-5 text-white"><a href="/">Home</a></li>
                <li className="mx-10 text-white"><a href="/About">Über uns</a></li>
                <li className="mx-10 text-white"><a href="/Produkt">Unsere Produkte</a></li>

                {user ? (
                    <>
                        {user?.role === "user" ? (
                                <>
                                    <li className="mx-10 text-white"><a href="/accounts">Konten</a></li>
                                    {/*<li className="mx-10 text-white"><a href="/ClientProfil">Profile</a></li>*/}
                                </>):
                            (<li className="mx-10 text-white"><a href="/AdminProfil">Profil</a></li>)
                        }
                        <li className="mx-10 text-white" onClick={handleLogout}><a href="#">Abmelden</a></li>
                    </>
                ) : (
                    <>
                        <li className="mx-10 text-white"><a href="/Register">Registrieren</a></li>
                        <li className="mx-10 text-white"><a href="/SignIn">Anmelden</a></li></>
                )}
            </ul>
        </nav>
    );
}

export default connect(null, null)(HorizontalNavbar);
