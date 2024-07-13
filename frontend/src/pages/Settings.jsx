import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context';
import SettingsMenu from "../components/settings/SettingsMenu";

const Settings = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user.role) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user.role) {
        return null;
    }

    return (
        <>
            <SettingsMenu />
        </>
    );
};

export default Settings;
