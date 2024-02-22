// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBRjCBsiQCUgsNwr69u878vatOCLoTDF5g",
    authDomain: "cummins-tla.firebaseapp.com",
    databaseURL: "https://cummins-tla-default-rtdb.firebaseio.com",
    projectId: "cummins-tla",
    storageBucket: "cummins-tla.appspot.com",
    messagingSenderId: "451146400017",
    appId: "1:451146400017:web:777412c1a5bdb4ea0eccb0",
    measurementId: "G-L2ZWW3ZT52"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);