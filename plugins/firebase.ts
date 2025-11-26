import { initializeApp } from 'firebase/app'
import { defineNuxtPlugin,useRuntimeConfig } from '#app'

import { getFirestore } from 'firebase/firestore';


export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
        apiKey: "AIzaSyDqfz59DW4ePuz5ZTwiNQynTGJrF-6il8Q",
        authDomain: "sakana-881ae.firebaseapp.com",
        projectId: "sakana-881ae",
        storageBucket: "sakana-881ae.appspot.com",
        messagingSenderId: "690044818508",
        appId: "1:690044818508:web:dbfdb5620ef4343319d0e9",
        measurementId: "G-SWL1HF863X"
  };

  
  initializeApp(firebaseConfig);


  // Firebaseの初期化
  const app = initializeApp(firebaseConfig);

  // Firestoreのインスタンスを取得
  const firestore = getFirestore(app);

  // Firestoreのインスタンスを提供
  return {
    provide: {
      firestore
    }
  }
})
