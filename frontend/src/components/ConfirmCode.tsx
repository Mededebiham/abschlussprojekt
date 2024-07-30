import React, { useState } from 'react';
import axios from 'axios';

const ConfirmCode = () => {
    const [inputCode, setInputCode] = useState('');
    const [message, setMessage] = useState('');

    const verifyCode = async () => {
        try {
            const response = await axios.post('http://localhost:5000/verify-code', { code: inputCode });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error verifying code:', error);
            setMessage('Fehler bei der Überprüfung des Codes.');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Geben Sie den Code ein"
            />
            <button onClick={verifyCode}>Bestätigen</button>
            <p>{message}</p>
        </div>
    );
};

export default ConfirmCode;
