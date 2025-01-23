// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import config from './config';

// Initialize Firebase
const firebaseApp = initializeApp(config);

// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
