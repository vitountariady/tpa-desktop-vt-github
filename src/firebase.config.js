// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVXm7p-yMdWn9ulMTpL4q68JbBKLVgCiw",
  authDomain: "tpa-desktop-vt.firebaseapp.com",
  projectId: "tpa-desktop-vt",
  storageBucket: "tpa-desktop-vt.appspot.com",
  messagingSenderId: "991312247027",
  appId: "1:991312247027:web:9a82a1251c2eba335a9f86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export{app,db}