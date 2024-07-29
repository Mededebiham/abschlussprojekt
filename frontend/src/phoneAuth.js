
import { auth } from './firebaseConfig.js'; // Import initialized auth
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export const sendVerificationCode = (phoneNumber, setConfirmationResult, setShowVerification) => {
    console.log("tel " + phoneNumber)

    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'normal',
        callback: (response) => {
            console.log("appVerifier " + appVerifier)

        },
        'expired-callback': () => {
            console.log("reCAPTCHA expired. Please try again.");
        }
    });

    if (document.getElementById('recaptcha-container')) {
        // Render the reCAPTCHA
        appVerifier.render().then((widgetId) => {
            console.log("reCAPTCHA rendered.", widgetId);

            // Proceed with phone number sign-in
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

        }).catch((error) => {
            console.error("Error rendering reCAPTCHA", error);
        });
    } else {
        console.error("recaptcha-container element not found in the DOM.");
    }
};
