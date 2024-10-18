// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBPRMdDQInMtb8bIiRpMdEp3f7F5AFeDz0',
  authDomain: 'kombat-e4b0a.firebaseapp.com',
  projectId: 'kombat-e4b0a',
  storageBucket: 'kombat-e4b0a.appspot.com',
  messagingSenderId: '588955015100',
  appId: '1:588955015100:web:6613a16330282f1bb43db9',
  measurementId: 'G-X551YGCQRW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and export it
export const db = getFirestore(app);
export const storage = getStorage(app);