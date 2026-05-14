import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
        apiKey: "AIzaSyDqfz59DW4ePuz5ZTwiNQynTGJrF-6il8Q",
        authDomain: "sakana-881ae.firebaseapp.com",
        projectId: "sakana-881ae",
        storageBucket: "sakana-881ae.appspot.com",
        messagingSenderId: "690044818508",
        appId: "1:690044818508:web:dbfdb5620ef4343319d0e9",
        measurementId: "G-SWL1HF863X"
}

// Firebase App
const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp()

// Firestore
export const firestore = getFirestore(app)