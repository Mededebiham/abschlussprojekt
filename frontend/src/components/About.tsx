import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {User} from '../store/types'

const About: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Provide the type for user

  useEffect(() => {
    // Retrieve parameters from cookies
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || '{}');

    setIsLoggedIn(loggedIn);
    setUser(userData);
  }, []);

  return (
    <div className="h-screen items-center">
      {isLoggedIn ? (
        <h2 className="text-white font-bold text-center ml-20 mt-20">You are logged in! {user?.username}</h2>
      ) : (
        <h2 className="text-white font-bold text-center ml-20 mt-20">You are not logged in.</h2>
      )}
    </div>
  );
}

export default About;
