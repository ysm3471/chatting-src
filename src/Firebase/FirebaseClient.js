import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAlTMdHpeDrYvJoO3n4I05K1Ouxe0O1ATw",
  authDomain: "test2-23ab7.firebaseapp.com",
  databaseURL: "https://test2-23ab7-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test2-23ab7",
  storageBucket: "test2-23ab7.appspot.com",
  messagingSenderId: "516190489964",
  appId: "1:516190489964:web:b86bee6a56531bc5ed7749",
  measurementId: "G-HD0TSDQRZ4"
};

export const app = initializeApp(firebaseConfig);