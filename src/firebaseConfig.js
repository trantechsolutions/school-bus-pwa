import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
    apiKey: "AIzaSyD6uEnUoWqBw3Kbz_hsh4Dw5pV3Jl7OxSU",
    authDomain: "school-bus-app-a8a61.firebaseapp.com",
    projectId: "school-bus-app-a8a61",
    storageBucket: "school-bus-app-a8a61.firebasestorage.app",
    messagingSenderId: "555367157416",
    appId: "1:555367157416:web:564047c539043761cd3c9d",
    measurementId: "G-ZQ2V28Q31R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the database instance to be used elsewhere
export { db, auth };