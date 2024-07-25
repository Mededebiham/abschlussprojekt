// src/PhoneVerification.tsx
import React, { useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';

const PhoneVerification: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState('');

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved - will proceed with submit function
            }
        }, auth);
    };

    const handleSendCode = async () => {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
        } catch (error) {
            console.error("Error during phone number verification", error);
        }
    };

    const handleVerifyCode = async () => {
        const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
        try {
            await signInWithCredential(auth, credential);
            // Doğrulama başarılı oldu
            console.log("Phone number verified");
            // Burada havale işlemini tamamlamak için gerekli kodu ekleyin
        } catch (error) {
            console.error("Error during code verification", error);
        }
    };

    return (
        <div>
            <h1>Phone Verification</h1>
    <input
    type="text"
    value={phoneNumber}
    onChange={(e) => setPhoneNumber(e.target.value)}
    placeholder="Phone Number"
    />
    <button onClick={handleSendCode}>Send Verification Code</button>
    <div id="recaptcha-container"></div>

        <input
    type="text"
    value={verificationCode}
    onChange={(e) => setVerificationCode(e.target.value)}
    placeholder="Verification Code"
    />
    <button onClick={handleVerifyCode}>Verify Code</button>

