// OTPVerification.tsx
import React, { useState } from 'react';
import { ConfirmationResult } from 'firebase/auth';
import { BsFillShieldLockFill } from "react-icons/bs";
import './css/OTPVerification.css'; // Import CSS file for styles

interface OTPVerificationProps {
    confirmationResult: ConfirmationResult | null;
    onVerify: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ confirmationResult, onVerify }) => {
    const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));

    const handleVerifyOTP = async () => {
        const code = verificationCode.join('');
        if (confirmationResult) {
            try {
                await confirmationResult.confirm(code);
                onVerify();
            } catch (error) {
                console.error('OTP verification failed:', error);
            }
        }
    };

    const handleChange = (value: string, index: number) => {
        const newCode = [...verificationCode];
        newCode[index] = value;
        setVerificationCode(newCode);

        if (value.length === 1 && index < 5) {
            (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement).focus();
        }
    };

    return (
        <div className="otp-verification-container">
            <BsFillShieldLockFill size={50} className="lock-icon" />
            <p>Geben Sie den Code ein</p>
            <div className="otp-inputs">
                {Array.from({ length: 6 }).map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={verificationCode[index]}
                        onChange={(e) => handleChange(e.target.value, index)}
                        id={`otp-input-${index}`}
                        className="otp-input"
                    />
                ))}
            </div>
            <button onClick={handleVerifyOTP} className="verify-button">Überprüfen</button>
        </div>
    );
};

export default OTPVerification;
