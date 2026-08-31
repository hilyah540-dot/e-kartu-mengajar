import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "valued-glazing-6t8c4",
  appId: "1:838687819781:web:412f021efacdec6048f46c",
  apiKey: "AIzaSyDSTJz9JdsFxmzfnhFOa_AfG03_6Kn2BUM",
  authDomain: "valued-glazing-6t8c4.firebaseapp.com",
  storageBucket: "valued-glazing-6t8c4.firebasestorage.app",
  messagingSenderId: "838687819781",
  measurementId: ""
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-eadministrasipon-6c69794b-489f-497d-9ca9-6566750a4d91");
