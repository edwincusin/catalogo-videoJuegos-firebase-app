// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBPYVqyRvB9T9Tua0tZ2bGbN1ASHz2fKvI",
  authDomain: "catalogo-videojuegos-taller9.firebaseapp.com",
  projectId: "catalogo-videojuegos-taller9",
  storageBucket: "catalogo-videojuegos-taller9.firebasestorage.app",
  messagingSenderId: "699120601205",
  appId: "1:699120601205:web:e95b095d00a2b8897fd03c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app);

export {db};

