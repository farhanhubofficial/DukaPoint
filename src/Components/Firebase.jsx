// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWwYKLSVPomoa9hQXueCZmPifAzctGNdQ",
  authDomain: "decorpoint-3b8f0.firebaseapp.com",
  projectId: "decorpoint-3b8f0",
  storageBucket: "decorpoint-3b8f0.appspot.com",
  messagingSenderId: "638269001100",
  appId: "1:638269001100:web:7958c1a168958685cf1aa9",
  measurementId: "G-N2619GFVBB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);