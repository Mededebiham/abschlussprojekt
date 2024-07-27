// phoneAuth.js
import { auth } from './firebaseConfig.js'; // Import initialized auth
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const sendVerificationCode = (phoneNumber, setConfirmationResult, setShowVerification) => {
    console.log("tel " + phoneNumber)
    // Create RecaptchaVerifier instance
    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal', // Can be 'invisible' or 'normal'
        callback: (response) => {
            // reCAPTCHA solved - proceed with phone number sign-in
            console.log("appVerifier " + appVerifier)
            signInWithPhoneNumber(auth, phoneNumber, appVerifier)
                .then((confirmationResult) => {
                    setConfirmationResult(confirmationResult);
                    setShowVerification(true);
                })
                .catch((error) => {
                    if (error.code === 'auth/too-many-requests') {
                        console.error("Too many requests. Please try again later.");
                    } else {
                        console.error("SMS not sent", error);
                    }
                });
        },
        'expired-callback': () => {
            console.log("reCAPTCHA expired. Please try again.");
        }
    });

    // Render the reCAPTCHA
    appVerifier.render().then(() => {
        console.log("reCAPTCHA rendered.");
    }).catch((error) => {
        console.error("Error rendering reCAPTCHA", error);
    });
};
