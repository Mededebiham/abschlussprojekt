import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../database/db';
import { UserContext } from '../context';
import Button from "../components/parts/Button";
import { useAlert } from '../alert';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { setAlert } = useAlert();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const credentials = { username, password };
            const res = await loginUser(credentials);
            setAlert({ content: res.message, type: 'info' });
            setUser(res.user);
            navigate('/');
        } catch (error) {
            setAlert({ content: error.message || 'Fehler beim Einloggen', type: 'danger' });
        }
    };

    return (
        <div className="flex justify-center items-center">
            <div className="w-full max-w-2xl mx-auto p-6 shadow-md rounded-lg bg-mantle">
                <h2 className="text-2xl font-bold mb-4 text-text">Anmelden</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-5">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="shadow-sm bg-surface0 border border-overlay1 text-text text-sm rounded-lg focus:ring-blue focus:border-blue block w-full p-2.5"
                            placeholder="E-Mail"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-5">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="shadow-sm bg-surface0 border border-overlay1 text-text text-sm rounded-lg focus:ring-blue focus:border-blue block w-full p-2.5"
                            placeholder="Passwort"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full mb-0">Login</Button>
                </form>
            </div>
        </div>
    );
};

export default Login;
