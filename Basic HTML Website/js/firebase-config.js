// Import the required Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyAav_PbbWYb7cTeis0xT2vZWyA3eC4qXHk",
    authDomain: "hamitcf-fced1.firebaseapp.com",
    databaseURL: "https://hamitcf-fced1-default-rtdb.firebaseio.com",
    projectId: "hamitcf-fced1",
    storageBucket: "hamitcf-fced1.firebasestorage.app",
    messagingSenderId: "176240506899",
    appId: "1:176240506899:web:5aeb969b1eaede5e5f27e6",
    measurementId: "G-5QB6E783F9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getDatabase(app);

// Reviews reference
export const reviewsRef = ref(db, 'reviews'); 