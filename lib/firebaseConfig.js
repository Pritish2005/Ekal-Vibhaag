// Import the functions you need from the SDKs you need
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgIfyC-bqz-BqB9dii0FW58aMU7kwCIoE",
  authDomain: "ekal-vibhaag.firebaseapp.com",
  projectId: "ekal-vibhaag",
  storageBucket: "ekal-vibhaag.appspot.com",
  messagingSenderId: "362133563727",
  appId: "1:362133563727:web:abcdaf7c211e0d92b8bd3a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
