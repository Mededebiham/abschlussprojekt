import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../store/types';
import { User } from "../store/types";
import './css/HorizontalNavbar.css';
import Cookies from 'js-cookie';

interface HorizontalNavbarProps {
  isLoggedIn: boolean;
  user: User | null;
  logout: () => void; // Pass the logout function as a prop
}

const HorizontalNavbar: React.FC<HorizontalNavbarProps> = ({ isLoggedIn, user, logout }) => {
  
  useEffect(() => {
    // This effect will run whenever isLoggedIn or user changes
  }, [isLoggedIn, user]); // Specify the dependencies here

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
        {user !== null && <li className="mx-10 text-white">Welcome {user?.username}!</li>}
        <li className="mr-5 text-white"><a href="/">Home</a></li>
        <li className="mx-10 text-white"><a href="/About">About</a></li>
        {isLoggedIn ? (
          <>
            {user?.role === "user" ? (<li className="mx-10 text-white"><a href="/ClientProfil">Profile</a></li>) :
              (<li className="mx-10 text-white"><a href="/AdminProfil">Profile</a></li>)
            }
            <li className="mx-10 text-white" onClick={handleLogout}><a href="#">Logout</a></li>
          </>
        ) : (
          <li className="mx-10 text-white"><a href="/SignIn">SignIn</a></li>
        )}
      </ul>
    </nav>
  );
}

export default connect(null, null)(HorizontalNavbar);
