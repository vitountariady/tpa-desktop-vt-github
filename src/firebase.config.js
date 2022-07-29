// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBS4_S7H4ofiCf66GHJ2u0QIM_lOd64T54",
    authDomain: "vito-tpa-desktop.firebaseapp.com",
    projectId: "vito-tpa-desktop",
    storageBucket: "vito-tpa-desktop.appspot.com",
    messagingSenderId: "78559418003",
    appId: "1:78559418003:web:afd06932809cf422dc1f66"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

export{app,db,storage}