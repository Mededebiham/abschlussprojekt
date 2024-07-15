import React, { useState, useEffect } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from '../src/store/store'; // Import your Redux store
import HorizontalNavbar from './components/HorizontalNavbar';
import VerticalNavbar from './components/VerticalNavbar';
import Router from './Router'; 
import Cookies from 'js-cookie';
import { User } from '../src/store/types';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Retrieve parameters from cookies
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || 'null');

    setIsLoggedIn(loggedIn);
    setUser(userData);
  }, []);

  const logout = () => {
    // Handle logout logic
    Cookies.remove('isloggedin');
    Cookies.remove('user');
    setIsLoggedIn(false);
    setUser(null);
    window.location.reload(); // Reload the page after logout
  };

  useEffect(() => {
    // Retrieve parameters from cookies
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || 'null');

    setIsLoggedIn(loggedIn);
    setUser(userData);
  }, []);

  return (
    <Provider store={store}>
      <div style={{ height: '100vh' }}>
        <div>
          {/* Pass the logout function as a prop */}
          <HorizontalNavbar isLoggedIn={isLoggedIn} user={user} logout={logout} />
        </div>
        <div style={{ display: 'flex' ,backgroundImage: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.2)), url(/background1.jpg) '  }}>
          <VerticalNavbar />
          <Router /> 
        </div>
      </div>
    </Provider>
  );
}

export default App;
