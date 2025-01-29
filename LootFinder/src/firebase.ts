// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import config from './config';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Initialize Firebase
const firebaseApp = initializeApp(config);

// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);
// Initialize Firestore
const db = getFirestore(firebaseApp);
// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

const storage = getStorage(firebaseApp)

export { auth, googleProvider,db, storage };
