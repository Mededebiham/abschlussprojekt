
import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import Cookies from "js-cookie";

const Produkt: React.FC = () => {
    const navigate = useNavigate();
    const userData = JSON.parse(Cookies.get('user') || '{}');

    useEffect(() => {

        if (userData?.confirmedByAdmin === false) {
            navigate('/Unconfirmed'); // Redirect to an unconfirmed user page
        } else {
            console.log("do sth else")
        }

    }, []);



    return (
        <div className="h-screen  items-center">
            <h2 className="text-white font-bold text-center ml-20 mt-20">Produkt  !</h2>
        </div>
    );
}

export default Produkt;