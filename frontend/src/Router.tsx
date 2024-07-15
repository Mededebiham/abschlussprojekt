// Router.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SignIn from './components/SignIn';
import AdminProfil from "./components/AdminProfil"
import ClientProfil from "./components/ClientProfil"
import NewPayout from "./components/NewPayout"
import About from "./components/About"

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route  path="/" element={<Home />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/About" element={<About />} />
        <Route path="/ClientProfil" element={<ClientProfil />} />
        <Route path="/AdminProfil" element={<AdminProfil />} />
        <Route path="/NewPayout" element={<NewPayout />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
