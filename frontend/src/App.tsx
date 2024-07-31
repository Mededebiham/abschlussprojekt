import React, { useState, useEffect } from 'react';
import './App.css';
import { Provider } from 'react-redux';
import store from '../src/store/store'; // Import your Redux store
import HorizontalNavbar from './components/HorizontalNavbar';
import VerticalNavbar from './components/VerticalNavbar';
import Router from './Router';
import Cookies from 'js-cookie';
import { User } from '../src/store/types';
import { useUser } from './store/UserContext';

function App() {
  const { setUser } = useUser();

  useEffect(() => {
    const loggedIn = Cookies.get('isloggedin') === 'true';
    const userData = JSON.parse(Cookies.get('user') || 'null');

    if (loggedIn && userData) {
      setUser(userData);
    }
  }, [setUser]);

  const logout = () => {
    Cookies.remove('isloggedin');
    Cookies.remove('user');
    setUser(null);
    window.location.reload(); // Reload the page after logout
  };

  return (
      <Provider store={store}>
        <div style={{ height: '100vh' }}>
          <div>
            <HorizontalNavbar logout={logout} />
          </div>
          <div style={{ display: 'flex' }}>
            <VerticalNavbar />
            <Router />
          </div>
        </div>
      </Provider>
  );
}

export default App;
