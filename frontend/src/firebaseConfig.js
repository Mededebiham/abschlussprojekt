// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6Elz9_dww96BSd8Ab8FJtssbzhuV21EA",
    authDomain: "finanz-pilot.firebaseapp.com",
    projectId: "finanz-pilot",
    storageBucket: "finanz-pilot.appspot.com",
    messagingSenderId: "851406256055",
    appId: "1:851406256055:web:fd80ffcd9a792662b85a32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
